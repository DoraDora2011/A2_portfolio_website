#!/usr/bin/env python3
"""
Create wireframe from images and compare layouts
Detects text regions, shapes, and extracts exact positions
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import sys
import json
import cv2

def detect_text_regions(img_path):
    """Detect text regions in image using edge detection and contour analysis"""
    img = cv2.imread(img_path)
    if img is None:
        print(f"Error: Could not load image {img_path}")
        return []
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply threshold to get binary image
    _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    text_regions = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = w * h
        
        # Filter by size (text regions are typically rectangular and not too small/large)
        if 100 < area < 50000 and h > 20 and w > 20:
            # Check aspect ratio (text is usually wider than tall, or square-ish)
            aspect_ratio = w / h if h > 0 else 0
            if 0.3 < aspect_ratio < 10:
                text_regions.append({
                    'x': int(x),
                    'y': int(y),
                    'width': int(w),
                    'height': int(h),
                    'type': 'text'
                })
    
    return text_regions

def detect_shapes(img_path):
    """Detect shapes (flowers, logos) using color-based segmentation"""
    img = cv2.imread(img_path)
    if img is None:
        return []
    
    # Convert to HSV for better color detection
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Detect green/yellow flowers (hue range for green-yellow)
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    shapes = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = w * h
        
        # Filter large shapes (flowers)
        if area > 5000:
            shapes.append({
                'x': int(x),
                'y': int(y),
                'width': int(w),
                'height': int(h),
                'type': 'flower'
            })
    
    return shapes

def create_wireframe(img_path, output_path, regions):
    """Create wireframe visualization"""
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    
    colors = {
        'text': 'red',
        'flower': 'green',
        'logo': 'blue'
    }
    
    for i, region in enumerate(regions):
        color = colors.get(region['type'], 'yellow')
        x, y = region['x'], region['y']
        w, h = region['width'], region['height']
        
        # Draw bounding box
        draw.rectangle([x, y, x + w, y + h], outline=color, width=2)
        
        # Draw label
        label = f"{region['type']} {i}"
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
        except:
            font = ImageFont.load_default()
        draw.text((x, y - 15), label, fill=color, font=font)
        
        # Draw coordinates
        coord_text = f"({x},{y}) {w}x{h}"
        draw.text((x, y + h + 2), coord_text, fill=color, font=font)
    
    img.save(output_path)
    print(f"✓ Wireframe saved to: {output_path}")

def compare_wireframes(wireframe1, wireframe2, output_path):
    """Compare two wireframes and highlight differences"""
    img1 = Image.open(wireframe1['image'])
    img2 = Image.open(wireframe2['image'])
    
    # Resize to same size
    if img1.size != img2.size:
        img2 = img2.resize(img1.size, Image.Resampling.LANCZOS)
    
    # Create comparison image
    comparison = Image.new('RGB', img1.size, (255, 255, 255))
    draw = ImageDraw.Draw(comparison)
    
    # Draw wireframe 1 in red
    for region in wireframe1['regions']:
        x, y = region['x'], region['y']
        w, h = region['width'], region['height']
        draw.rectangle([x, y, x + w, y + h], outline='red', width=2)
    
    # Draw wireframe 2 in blue
    for region in wireframe2['regions']:
        x, y = region['x'], region['y']
        w, h = region['width'], region['height']
        draw.rectangle([x, y, x + w, y + h], outline='blue', width=2)
    
    comparison.save(output_path)
    print(f"✓ Comparison saved to: {output_path}")

def extract_layout_data(regions, scale_factor=1.0):
    """Extract layout data from regions and generate CSS-like structure"""
    layout = {
        'elements': [],
        'scale_factor': scale_factor
    }
    
    for i, region in enumerate(regions):
        element = {
            'id': f"element_{i}",
            'type': region['type'],
            'position': {
                'left': region['x'] * scale_factor,
                'top': region['y'] * scale_factor,
                'width': region['width'] * scale_factor,
                'height': region['height'] * scale_factor
            }
        }
        layout['elements'].append(element)
    
    return layout

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/create-wireframe.py <image1> <image2> [output_dir]")
        print("  image1: Current implementation screenshot")
        print("  image2: Figma design screenshot")
        sys.exit(1)
    
    img1_path = sys.argv[1]
    img2_path = sys.argv[2]
    output_dir = sys.argv[3] if len(sys.argv) > 3 else "scripts/output"
    
    print(f"📸 Processing images...")
    print(f"  Image 1: {img1_path}")
    print(f"  Image 2: {img2_path}")
    
    # Detect regions in both images
    print("\n🔍 Detecting text regions...")
    regions1 = detect_text_regions(img1_path)
    regions2 = detect_text_regions(img2_path)
    
    print(f"  Found {len(regions1)} text regions in image 1")
    print(f"  Found {len(regions2)} text regions in image 2")
    
    print("\n🌺 Detecting shapes...")
    shapes1 = detect_shapes(img1_path)
    shapes2 = detect_shapes(img2_path)
    
    print(f"  Found {len(shapes1)} shapes in image 1")
    print(f"  Found {len(shapes2)} shapes in image 2")
    
    # Combine regions
    all_regions1 = regions1 + shapes1
    all_regions2 = regions2 + shapes2
    
    # Create wireframes
    print("\n📐 Creating wireframes...")
    wireframe1_path = f"{output_dir}/wireframe-current.png"
    wireframe2_path = f"{output_dir}/wireframe-figma.png"
    
    create_wireframe(img1_path, wireframe1_path, all_regions1)
    create_wireframe(img2_path, wireframe2_path, all_regions2)
    
    # Compare
    print("\n⚖️  Comparing wireframes...")
    comparison_path = f"{output_dir}/wireframe-comparison.png"
    compare_wireframes(
        {'image': img1_path, 'regions': all_regions1},
        {'image': img2_path, 'regions': all_regions2},
        comparison_path
    )
    
    # Extract layout data
    print("\n📊 Extracting layout data...")
    scale_factor = 375 / 440  # Mobile scale
    layout1 = extract_layout_data(all_regions1, 1.0)
    layout2 = extract_layout_data(all_regions2, scale_factor)
    
    # Save JSON
    with open(f"{output_dir}/wireframe-current.json", 'w') as f:
        json.dump(layout1, f, indent=2)
    with open(f"{output_dir}/wireframe-figma.json", 'w') as f:
        json.dump(layout2, f, indent=2)
    
    print(f"\n✅ Complete!")
    print(f"  Wireframes: {wireframe1_path}, {wireframe2_path}")
    print(f"  Comparison: {comparison_path}")
    print(f"  JSON data: {output_dir}/wireframe-*.json")

if __name__ == '__main__':
    main()

