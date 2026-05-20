import re
import json
import sys

log_path = r'C:\Users\Vivek\.gemini\antigravity\brain\f2f4b0fb-71d5-4fe2-a0a8-f2b14bd19406\.system_generated\logs\overview.txt'
try:
    with open(log_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract the JSON block from the user's first message
    start_idx = content.find('{\n  "plan": {')
    if start_idx != -1:
        # Find the truncation marker
        trunc_idx = content.find('<truncated', start_idx)
        if trunc_idx != -1:
            json_str = content[start_idx:trunc_idx].strip()
            # Fix the truncation
            # The last line is: '          "topic": "Cloud Certification — final pract'
            json_str += 'ice" } ] } ] }'
            
            try:
                data = json.loads(json_str)
                print('Successfully parsed fixed JSON. Number of days:', len(data.get('days', [])))
                with open(r'c:\Users\Vivek\Downloads\Hackathons\todo\src\roadmap.json', 'w', encoding='utf-8') as out_f:
                    json.dump(data, out_f, indent=2)
                print('Saved to src/roadmap.json')
            except Exception as e:
                print('Error parsing JSON:', e)
                print('Tail of json_str:', json_str[-100:])
        else:
            print("Could not find <truncated marker.")
    else:
        print("Could not find start of JSON.")
except Exception as e:
    print(f"File error: {e}")
