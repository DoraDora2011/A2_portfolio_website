#!/usr/bin/env python3
"""
Improved wireframe detection - focuses on large text blocks
Merges nearby regions and filters noise
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import sys
import json

def merge_nearby_regions(regions, merge_threshold=50):
    """Merge regions that are close to each other"""
    if not regions:
        return []
    
    merged = []
    used = [False] * len(regions)
    
    for i, region in enumerate(regions):
        if used[i]:
            continue
        
        # Start with this region
        merged_region = {
            'x': region['x'],
            'y': region['y'],
            'width': region['width'],
            'height': region['height'],
            'type': region['type'],
            'area': region.get('area', region['width'] * region['height'])
        }
        
        # Find nearby regions to merge
        for j in range(i + 1, len(regions)):
            if used[j]:
                continue
            
            other = regions[j]
            
            # Check if regions are close (horizontally or vertically aligned)
            # Horizontal merge: same y-level, close x
            if abs(other['y'] - merged_region['y']) < merge_threshold:
                if (other['x'] <= merged_region['x'] + merged_region['width'] + merge_threshold or
                    merged_region['x'] <= other['x'] + other['width'] + merge_threshold):
                    # Merge horizontally
                    min_x = min(merged_region['x'], other['x'])
                    max_x = max(merged_region['x'] + merged_region['width'], 
                               other['x'] + other['width'])
                    min_y = min(merged_region['y'], other['y'])
                    max_y = max(merged_region['y'] + merged_region['height'],
                               other['y'] + other['height'])
                    
                    merged_region['x'] = min_x
                    merged_region['y'] = min_y
                    merged_region['width'] = max_x - min_x
                    merged_region['height'] = max_y - min_y
                    merged_region['area'] = merged_region['width'] * merged_region['height']
                    used[j] = True
            
            # Vertical merge: same x-level, close y
            elif abs(other['x'] - merged_region['x']) < merge_threshold:
                if (other['y'] <= merged_region['y'] + merged_region['height'] + merge_threshold or
                    merged_region['y'] <= other['y'] + other['height'] + merge_threshold):
                    # Merge vertically
                    min_x = min(merged_region['x'], other['x'])
                    max_x = max(merged_region['x'] + merged_region['width'],
                               other['x'] + other['width'])
                    min_y = min(merged_region['y'], other['y'])
                    max_y = max(merged_region['y'] + merged_region['height'],
                               other['y'] + other['height'])
                    
                    merged_region['x'] = min_x
                    merged_region['y'] = min_y
                    merged_region['width'] = max_x - min_x
                    merged_region['height'] = max_y - min_y
                    merged_region['area'] = merged_region['width'] * merged_region['height']
                    used[j] = True
        
        merged.append(merged_region)
        used[i] = True
    
    return merged

def detect_large_text_blocks(img, min_width=50, min_height=30):
    """Detect large text blocks by finding white regions"""
    img_array = np.array(img.convert('RGB'))
    height, width = img_array.shape[:2]
    
    # Find white pixels
    white_threshold = 200
    white_mask = (img_array[:, :, 0] > white_threshold) & \
                 (img_array[:, :, 1] > white_threshold) & \
                 (img_array[:, :, 2] > white_threshold)
    
    # Use horizontal projection to find text lines
    horizontal_projection = np.sum(white_mask, axis=1)
    
    # Find text line regions (where projection > threshold)
    line_threshold = width * 0.1  # At least 10% of width
    text_lines = []
    in_line = False
    line_start = 0
    
    for y, projection in enumerate(horizontal_projection):
        if projection > line_threshold:
            if not in_line:
                line_start = y
                in_line = True
        else:
            if in_line:
                text_lines.append((line_start, y))
                in_line = False
    
    if in_line:
        text_lines.append((line_start, height - 1))
    
    # For each text line, find left and right boundaries
    regions = []
    for line_start, line_end in text_lines:
        line_mask = white_mask[line_start:line_end+1, :]
        vertical_projection = np.sum(line_mask, axis=0)
        
        # Find left and right boundaries
        left = 0
        right = width - 1
        
        for x in range(width):
            if vertical_projection[x] > 0:
                left = x
                break
        
        for x in range(width - 1, -1, -1):
            if vertical_projection[x] > 0:
                right = x
                break
        
        w = right - left + 1
        h = line_end - line_start + 1
        
        if w >= min_width and h >= min_height:
            regions.append({
                'x': int(left),
                'y': int(line_start),
                'width': int(w),
                'height': int(h),
                'type': 'text',
                'area': w * h
            })
    
    return regions

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/improve-wireframe.py <image1> <image2> [output_dir]")
        sys.exit(1)
    
    img1_path = sys.argv[1]
    img2_path = sys.argv[2]
    output_dir = sys.argv[3] if len(sys.argv) > 3 else "scripts/output"
    
    print(f"📸 Processing with improved detection...")
    
    img1 = Image.open(img1_path)
    img2 = Image.open(img2_path)
    
    if img1.size != img2.size:
        img2 = img2.resize(img1.size, Image.Resampling.LANCZOS)
    
    print("🔍 Detecting large text blocks...")
    regions1 = detect_large_text_blocks(img1)
    regions2 = detect_large_text_blocks(img2)
    
    print(f"  Current: {len(regions1)} text blocks")
    print(f"  Figma: {len(regions2)} text blocks")
    
    # Merge nearby regions
    print("\n🔗 Merging nearby regions...")
    merged1 = merge_nearby_regions(regions1)
    merged2 = merge_nearby_regions(regions2)
    
    print(f"  Current: {len(merged1)} merged regions")
    print(f"  Figma: {len(merged2)} merged regions")
    
    # Sort by position
    merged1.sort(key=lambda r: (r['y'], r['x']))
    merged2.sort(key=lambda r: (r['y'], r['x']))
    
    # Create wireframes
    def create_wireframe(img_path, output_path, regions):
        """Create wireframe visualization"""
        img = Image.open(img_path).copy()
        draw = ImageDraw.Draw(img)
        
        colors = {'text': 'red', 'flower': 'green', 'logo': 'blue'}
        
        for i, region in enumerate(regions):
            color = colors.get(region['type'], 'yellow')
            x, y = region['x'], region['y']
            w, h = region['width'], region['height']
            draw.rectangle([x, y, x + w, y + h], outline=color, width=3)
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
            except:
                font = ImageFont.load_default()
            draw.text((x, max(0, y - 20)), f"{region['type']} {i}", fill=color, font=font)
            draw.text((x, y + h + 2), f"({x},{y}) {w}x{h}", fill=color, font=font)
        img.save(output_path)
        print(f"✓ Wireframe saved: {output_path}")
    
    create_wireframe(img1_path, f"{output_dir}/wireframe-improved-current.png", merged1)
    create_wireframe(img2_path, f"{output_dir}/wireframe-improved-figma.png", merged2)
    
    # Extract and save
    scale_factor = 375 / 440
    layout1 = {
        'elements': [{
            'id': f"element_{i}",
            'type': r['type'],
            'position': {
                'left': round(r['x'], 1),
                'top': round(r['y'], 1),
                'width': round(r['width'], 1),
                'height': round(r['height'], 1)
            }
        } for i, r in enumerate(merged1)],
        'scale_factor': 1.0
    }
    
    layout2 = {
        'elements': [{
            'id': f"element_{i}",
            'type': r['type'],
            'position': {
                'left': round(r['x'] * scale_factor, 1),
                'top': round(r['y'] * scale_factor, 1),
                'width': round(r['width'] * scale_factor, 1),
                'height': round(r['height'] * scale_factor, 1)
            }
        } for i, r in enumerate(merged2)],
        'scale_factor': scale_factor
    }
    
    with open(f"{output_dir}/wireframe-improved-current.json", 'w') as f:
        json.dump(layout1, f, indent=2)
    with open(f"{output_dir}/wireframe-improved-figma.json", 'w') as f:
        json.dump(layout2, f, indent=2)
    
    print(f"\n✅ Improved wireframes created!")
    print(f"  Files: {output_dir}/wireframe-improved-*.png/json")
    
    # Print comparison
    print(f"\n📋 Layout Comparison:")
    print(f"  Current: {len(merged1)} elements")
    print(f"  Figma: {len(merged2)} elements")
    
    if len(merged1) > 0 and len(merged2) > 0:
        print(f"\n📍 Element positions:")
        for i in range(min(len(merged1), len(merged2))):
            r1 = merged1[i]
            r2 = merged2[i]
            print(f"  Element {i}:")
            print(f"    Current: ({r1['x']}, {r1['y']}) {r1['width']}x{r1['height']}")
            print(f"    Figma:   ({r2['x']}, {r2['y']}) {r2['width']}x{r2['height']}")
            scaled_x = r2['x'] * scale_factor
            scaled_y = r2['y'] * scale_factor
            diff_x = abs(r1['x'] - scaled_x)
            diff_y = abs(r1['y'] - scaled_y)
            print(f"    Scaled:  ({scaled_x:.1f}, {scaled_y:.1f})")
            print(f"    Diff:    x={diff_x:.1f}px, y={diff_y:.1f}px\n")

if __name__ == '__main__':
    main()

