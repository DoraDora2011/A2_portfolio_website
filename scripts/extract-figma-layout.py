#!/usr/bin/env python3
"""
Extract exact layout from Figma design code
Uses the React/Tailwind code from Figma API to get precise positions
"""

import json
import sys
import re

def parse_figma_code_to_layout(figma_code):
    """Parse Figma React code to extract layout positions"""
    layout = {
        'elements': []
    }
    
    # Extract all absolute positioned elements
    # Pattern: className="absolute ... left-[Xpx] top-[Ypx] w-[Wpx] h-[Hpx]"
    patterns = [
        r'left-\[(\d+)px\]',
        r'top-\[(\d+)px\]',
        r'w-\[(\d+)px\]',
        r'h-\[(\d+)px\]',
        r'text-\[(\d+)px\]',  # font-size
    ]
    
    # Find text elements
    text_elements = re.findall(r'<p[^>]*>(.*?)</p>', figma_code, re.DOTALL)
    
    # Find positions for each element
    lines = figma_code.split('\n')
    current_element = None
    
    for line in lines:
        # Check if this is a new element
        if '<p' in line or '<div' in line:
            # Extract className
            class_match = re.search(r'className="([^"]*)"', line)
            if class_match:
                classes = class_match.group(1)
                
                # Extract positions
                left_match = re.search(r'left-\[(\d+)px\]', classes)
                top_match = re.search(r'top-\[(\d+)px\]', classes)
                w_match = re.search(r'w-\[(\d+)px\]', classes)
                h_match = re.search(r'h-\[(\d+)px\]', classes)
                text_match = re.search(r'text-\[(\d+)px\]', classes)
                
                if left_match or top_match:
                    element = {
                        'left': int(left_match.group(1)) if left_match else 0,
                        'top': int(top_match.group(1)) if top_match else 0,
                        'width': int(w_match.group(1)) if w_match else None,
                        'height': int(h_match.group(1)) if h_match else None,
                        'fontSize': int(text_match.group(1)) if text_match else None,
                        'classes': classes
                    }
                    layout['elements'].append(element)
    
    return layout

def scale_layout(layout, scale_factor, target_width=375):
    """Scale layout from Figma frame to mobile width"""
    scaled = {
        'elements': [],
        'scale_factor': scale_factor,
        'target_width': target_width
    }
    
    for element in layout['elements']:
        scaled_element = {
            'left': round(element['left'] * scale_factor, 1),
            'top': round(element['top'] * scale_factor, 1),
            'width': round(element['width'] * scale_factor, 1) if element['width'] else None,
            'height': round(element['height'] * scale_factor, 1) if element['height'] else None,
            'fontSize': round(element['fontSize'] * scale_factor, 1) if element['fontSize'] else None,
            'original': element
        }
        scaled['elements'].append(scaled_element)
    
    return scaled

def generate_css_from_layout(layout, selector_prefix='.home-1'):
    """Generate CSS from layout data"""
    css = f"/* Generated from Figma layout - {len(layout['elements'])} elements */\n"
    css += f"/* Scale: {layout['scale_factor']}, Target width: {layout['target_width']}px */\n\n"
    
    for i, element in enumerate(layout['elements']):
        css += f"{selector_prefix}__element-{i} {{\n"
        css += f"  position: absolute;\n"
        css += f"  left: {element['left']}px;\n"
        css += f"  top: {element['top']}px;\n"
        if element['width']:
            css += f"  width: {element['width']}px;\n"
        if element['height']:
            css += f"  height: {element['height']}px;\n"
        if element['fontSize']:
            css += f"  font-size: {element['fontSize']}px;\n"
        css += f"}}\n\n"
    
    return css

def main():
    # Figma design code from API (hardcoded for now, can be read from file)
    figma_home1_code = """
    <p className="absolute font-['Handjet:Light',sans-serif] font-light leading-[normal] left-[394px] text-[0px] text-[64px] text-nowrap text-right text-white top-[261px] translate-x-[-100%]" data-node-id="78:164" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
      <span className="font-['Handjet:SemiBold',sans-serif] font-semibold" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
        Dora
      </span>
      Chann
    </p>
    <p className="absolute font-['Handjet:SemiBold',sans-serif] font-semibold leading-[normal] left-[399px] text-[0px] text-[128px] text-nowrap text-right text-white top-[318px] translate-x-[-100%]" data-node-id="78:165" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
      Port<span className="font-['Bilbo_Swash_Caps:Regular',sans-serif] not-italic">fo</span>Lio
    </p>
    """
    
    figma_home2_code = """
    <p className="absolute font-['Handjet:SemiBold',sans-serif] font-semibold leading-[normal] left-[103px] text-[64px] text-nowrap text-white top-[285px]" data-node-id="78:174" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
      WELCOME
    </p>
    <p className="absolute font-['Handjet:SemiBold',sans-serif] font-semibold leading-[normal] left-[205px] text-[64px] text-nowrap text-white top-[342px]" data-node-id="78:175" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
      TO
    </p>
    <p className="absolute font-['Bilbo_Swash_Caps:Regular',sans-serif] leading-[normal] left-[255px] not-italic text-[64px] text-nowrap text-white top-[342px]" data-node-id="78:176">
      my
    </p>
    <p className="absolute font-['Handjet:Light',sans-serif] font-light leading-[normal] left-[51px] text-[64px] text-nowrap text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-white top-[399px]" data-node-id="78:177" style={{ fontVariationSettings: "'ELGR' 1, 'ELSH' 2" }}>
      Vietnameseland
    </p>
    """
    
    output_dir = sys.argv[1] if len(sys.argv) > 1 else "scripts/output"
    scale_factor = 375 / 440  # Mobile scale
    
    print("📐 Extracting layout from Figma design code...\n")
    
    # Parse Home 1
    print("=== HOME 1: DoraChann Portfolio ===")
    layout1 = parse_figma_code_to_layout(figma_home1_code)
    scaled1 = scale_layout(layout1, scale_factor)
    
    print(f"Found {len(scaled1['elements'])} elements:")
    for i, el in enumerate(scaled1['elements']):
        print(f"  Element {i}: left={el['left']}px, top={el['top']}px, fontSize={el['fontSize']}px")
    
    # Parse Home 2
    print("\n=== HOME 2: WELCOME TO my Vietnameseland ===")
    layout2 = parse_figma_code_to_layout(figma_home2_code)
    scaled2 = scale_layout(layout2, scale_factor)
    
    print(f"Found {len(scaled2['elements'])} elements:")
    for i, el in enumerate(scaled2['elements']):
        print(f"  Element {i}: left={el['left']}px, top={el['top']}px, fontSize={el['fontSize']}px")
    
    # Save JSON
    with open(f"{output_dir}/figma-layout-home1.json", 'w') as f:
        json.dump(scaled1, f, indent=2)
    with open(f"{output_dir}/figma-layout-home2.json", 'w') as f:
        json.dump(scaled2, f, indent=2)
    
    # Generate CSS
    css1 = generate_css_from_layout(scaled1, '.home-1')
    css2 = generate_css_from_layout(scaled2, '.home-2')
    
    with open(f"{output_dir}/figma-layout-home1.css", 'w') as f:
        f.write(css1)
    with open(f"{output_dir}/figma-layout-home2.css", 'w') as f:
        f.write(css2)
    
    print(f"\n✅ Layout extracted!")
    print(f"  JSON: {output_dir}/figma-layout-home*.json")
    print(f"  CSS: {output_dir}/figma-layout-home*.css")

if __name__ == '__main__':
    main()

