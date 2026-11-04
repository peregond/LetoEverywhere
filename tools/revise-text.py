"""Revises a Russian story string in the sources and adds its English text to public/locales/en.json.
The old string stays in en.json, so history saved by older versions still translates.
Usage: python3 tools/revise-text.py edits.json   (list of {"old":..., "new":..., "en":...})"""
import json,sys,glob
edits=json.load(open(sys.argv[1],encoding='utf8'))
files={p:open(p,encoding='utf8').read() for p in glob.glob('public/*.js')}
dictionary=json.load(open('public/locales/en.json',encoding='utf8'))
for edit in edits:
    hits=[p for p,s in files.items() if edit['old'] in s]
    if not hits:
        print('NOT FOUND:',edit['old'][:80]);continue
    for p in hits:files[p]=files[p].replace(edit['old'],edit['new'])
    if edit.get('en'):dictionary[edit['new']]=edit['en']
    print('ok',hits,edit['old'][:50])
for p,s in files.items():open(p,'w',encoding='utf8').write(s)
json.dump(dictionary,open('public/locales/en.json','w',encoding='utf8'),ensure_ascii=False,indent=2);open('public/locales/en.json','a').write('\n')
