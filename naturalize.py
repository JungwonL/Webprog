import sys
from konlpy.tag import Komoran
komoran = Komoran()

sentences = sys.argv[1]

#sentences = 'apple, potato, this is test'
s = sentences.encode('utf8')

morphs = komoran.pos(sentences)     #pos: Every mophs
#morphs = komoran.nouns(sentences)  # nouns: N
morphs.sort()
i=0
k=0

nat = [[0]*2 for _ in range(len(morphs))]

while i<len(morphs)-1:
    nat[k][1]=morphs[i]             #nat[k][1]=morphs
    nat[k][0]+=1                    #nat[k][0]=cnt
    if morphs[i]!=morphs[i+1]:
        k+=1
    i+=1

nat.sort(reverse=True)

i=0
while i<len(morphs):                #del[0,0]
    if nat[i][0]==0:
        del nat[i:len(nat)]
        break
    i+=1

diet = str(nat)

i=0
while i<len(diet):
    if diet[i]=='['or']'or'('or')':
        diet.strip(diet[i])
        #i-=1
    i+=1     

s=str(nat).encode('ascii', 'xmlcharrefreplace')

print(s)
#while i < len(nat):
#    print(nat[i], nat[i+1], nat[i+2], nat[i+3])
#    i+=4
