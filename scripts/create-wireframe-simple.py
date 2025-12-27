#!/usr/bin/env python3
"""
Create wireframe from images using simple pixel analysis
Detects white text regions and extracts exact positions
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import sys
import json

def detect_white_regions(img, threshold=200, min_area=500):
    """Detect white/light regions (text) in image"""
    img_array = np.array(img.convert('RGB'))
    
    # Find white pixels (R, G, B all > threshold)
    white_mask = (img_array[:, :, 0] > threshold) & \
                 (img_array[:, :, 1] > threshold) & \
                 (img_array[:, :, 2] > threshold)
    
    # Find connected components
    regions = []
    visited = np.zeros(white_mask.shape, dtype=bool)
    height, width = white_mask.shape
    
    def flood_fill(start_y, start_x):
        """Flood fill to find connected region"""
        stack = [(start_y, start_x)]
        min_x, max_x = start_x, start_x
        min_y, max_y = start_y, start_y
        
        while stack:
            y, x = stack.pop()
            if y < 0 or y >= height or x < 0 or x >= width:
                continue
            if visited[y, x] or not white_mask[y, x]:
                continue
            
            visited[y, x] = True
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)
            
            # Check neighbors
            stack.extend([(y-1, x), (y+1, x), (y, x-1), (y, x+1)])
        
        w = max_x - min_x + 1
        h = max_y - min_y + 1
        area = w * h
        
        if area >= min_area and w > 10 and h > 10:
            return {
                'x': int(min_x),
                'y': int(min_y),
                'width': int(w),
                'height': int(h),
                'type': 'text',
                'area': area
            }
        return None
    
    # Find all regions
    for y in range(height):
        for x in range(width):
            if white_mask[y, x] and not visited[y, x]:
                region = flood_fill(y, x)
                if region:
                    regions.append(region)
    
    # Sort by position (top to bottom, left to right)
    regions.sort(key=lambda r: (r['y'], r['x']))
    
    return regions

def detect_green_regions(img, threshold_green=100):
    """Detect green/yellow regions (flowers)"""
    img_array = np.array(img.convert('RGB'))
    
    # Find green pixels (G > R and G > B)
    green_mask = (img_array[:, :, 1] > threshold_green) & \
                 (img_array[:, :, 1] > img_array[:, :, 0]) & \
                 (img_array[:, :, 1] > img_array[:, :, 2])
    
    regions = []
    visited = np.zeros(green_mask.shape, dtype=bool)
    height, width = green_mask.shape
    
    def flood_fill(start_y, start_x):
        stack = [(start_y, start_x)]
        min_x, max_x = start_x, start_x
        min_y, max_y = start_y, start_y
        
        while stack:
            y, x = stack.pop()
            if y < 0 or y >= height or x < 0 or x >= width:
                continue
            if visited[y, x] or not green_mask[y, x]:
                continue
            
            visited[y, x] = True
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)
            
            stack.extend([(y-1, x), (y+1, x), (y, x-1), (y, x+1)])
        
        w = max_x - min_x + 1
        h = max_y - min_y + 1
        area = w * h
        
        if area >= 5000:  # Flowers are large
            return {
                'x': int(min_x),
                'y': int(min_y),
                'width': int(w),
                'height': int(h),
                'type': 'flower',
                'area': area
            }
        return None
    
    for y in range(height):
        for x in range(width):
            if green_mask[y, x] and not visited[y, x]:
                region = flood_fill(y, x)
                if region:
                    regions.append(region)
    
    return regions

def create_wireframe(img_path, output_path, regions):
    """Create wireframe visualization"""
    img = Image.open(img_path).copy()
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
        draw.rectangle([x, y, x + w, y + h], outline=color, width=3)
        
        # Draw label
        label = f"{region['type']} {i}"
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        except:
            try:
                font = ImageFont.truetype("Arial.ttf", 14)
            except:
                font = ImageFont.load_default()
        
        # Draw label above box
        draw.text((x, max(0, y - 20)), label, fill=color, font=font)
        
        # Draw coordinates
        coord_text = f"({x},{y}) {w}x{h}"
        draw.text((x, y + h + 2), coord_text, fill=color, font=font)
    
    img.save(output_path)
    print(f"✓ Wireframe saved: {output_path} ({len(regions)} regions)")

def extract_layout_data(regions, scale_factor=1.0, frame_width=375):
    """Extract layout data and generate CSS structure"""
    layout = {
        'elements': [],
        'scale_factor': scale_factor,
        'frame_width': frame_width
    }
    
    for i, region in enumerate(regions):
        element = {
            'id': f"element_{i}",
            'type': region['type'],
            'position': {
                'left': round(region['x'] * scale_factor, 1),
                'top': round(region['y'] * scale_factor, 1),
                'width': round(region['width'] * scale_factor, 1),
                'height': round(region['height'] * scale_factor, 1)
            },
            'original': {
                'left': region['x'],
                'top': region['y'],
                'width': region['width'],
                'height': region['height']
            }
        }
        layout['elements'].append(element)
    
    return layout

def generate_css_from_wireframe(layout, selector_prefix='.home-1'):
    """Generate CSS from wireframe layout"""
    css = f"/* Generated from wireframe - {len(layout['elements'])} elements */\n"
    css += f"/* Scale factor: {layout['scale_factor']}, Frame width: {layout['frame_width']}px */\n\n"
    
    for i, element in enumerate(layout['elements']):
        pos = element['position']
        css += f"{selector_prefix}__element-{i} {{\n"
        css += f"  position: absolute;\n"
        css += f"  left: {pos['left']}px;\n"
        css += f"  top: {pos['top']}px;\n"
        css += f"  width: {pos['width']}px;\n"
        css += f"  height: {pos['height']}px;\n"
        css += f"}}\n\n"
    
    return css

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/create-wireframe-simple.py <image1> <image2> [output_dir]")
        sys.exit(1)
    
    img1_path = sys.argv[1]
    img2_path = sys.argv[2]
    output_dir = sys.argv[3] if len(sys.argv) > 3 else "scripts/output"
    
    print(f"📸 Processing images...")
    print(f"  Current: {img1_path}")
    print(f"  Figma: {img2_path}\n")
    
    # Load images
    img1 = Image.open(img1_path)
    img2 = Image.open(img2_path)
    
    # Resize Figma to match current if needed
    if img1.size != img2.size:
        print(f"⚠️  Resizing Figma image from {img2.size} to {img1.size}")
        img2 = img2.resize(img1.size, Image.Resampling.LANCZOS)
        img2_path_resized = f"{output_dir}/figma-resized.png"
        img2.save(img2_path_resized)
        img2_path = img2_path_resized
    
    # Detect regions
    print("🔍 Detecting white text regions...")
    text_regions1 = detect_white_regions(img1)
    text_regions2 = detect_white_regions(img2)
    
    print(f"  Current: {len(text_regions1)} text regions")
    print(f"  Figma: {len(text_regions2)} text regions")
    
    print("\n🌺 Detecting green/yellow shapes (flowers)...")
    flower_regions1 = detect_green_regions(img1)
    flower_regions2 = detect_green_regions(img2)
    
    print(f"  Current: {len(flower_regions1)} flower regions")
    print(f"  Figma: {len(flower_regions2)} flower regions")
    
    # Combine
    all_regions1 = text_regions1 + flower_regions1
    all_regions2 = text_regions2 + flower_regions2
    
    # Create wireframes
    print("\n📐 Creating wireframes...")
    create_wireframe(img1_path, f"{output_dir}/wireframe-current.png", all_regions1)
    create_wireframe(img2_path, f"{output_dir}/wireframe-figma.png", all_regions2)
    
    # Extract layout data
    print("\n📊 Extracting layout data...")
    scale_factor = 375 / 440  # Mobile scale
    layout1 = extract_layout_data(all_regions1, 1.0, img1.size[0])
    layout2 = extract_layout_data(all_regions2, scale_factor, img2.size[0])
    
    # Save JSON
    with open(f"{output_dir}/wireframe-current.json", 'w') as f:
        json.dump(layout1, f, indent=2)
    with open(f"{output_dir}/wireframe-figma.json", 'w') as f:
        json.dump(layout2, f, indent=2)
    
    # Generate CSS
    print("\n💻 Generating CSS...")
    css1 = generate_css_from_wireframe(layout1, '.home-1')
    css2 = generate_css_from_wireframe(layout2, '.home-1-figma')
    
    with open(f"{output_dir}/wireframe-current.css", 'w') as f:
        f.write(css1)
    with open(f"{output_dir}/wireframe-figma.css", 'w') as f:
        f.write(css2)
    
    print(f"\n✅ Complete!")
    print(f"  Wireframes: {output_dir}/wireframe-*.png")
    print(f"  JSON: {output_dir}/wireframe-*.json")
    print(f"  CSS: {output_dir}/wireframe-*.css")
    
    # Print comparison
    print(f"\n📋 Layout Summary:")
    print(f"  Current: {len(all_regions1)} elements")
    print(f"  Figma: {len(all_regions2)} elements")
    
    if len(all_regions1) > 0 and len(all_regions2) > 0:
        print(f"\n🔍 First few elements comparison:")
        for i in range(min(3, len(all_regions1), len(all_regions2))):
            r1 = all_regions1[i]
            r2 = all_regions2[i]
            print(f"  Element {i}:")
            print(f"    Current: ({r1['x']}, {r1['y']}) {r1['width']}x{r1['height']}")
            print(f"    Figma:   ({r2['x']}, {r2['y']}) {r2['width']}x{r2['height']}")
            if r1['type'] == 'text':
                diff_x = abs(r1['x'] - r2['x'] * scale_factor)
                diff_y = abs(r1['y'] - r2['y'] * scale_factor)
                print(f"    Diff:    x={diff_x:.1f}px, y={diff_y:.1f}px")

if __name__ == '__main__':
    main()

