# Documentação de Descobertas

## Informações Gerais

**Nome do Projeto**: *****

**Descrição**: 
- duas API flask e um IP camera emulator com imagezmq (trafic_countig e object_counting e video_streamer).  
- as server api flask se comunicam com o video_streamer por ????????(websoket? tcp? nao sei)?

**Linguagem/Framework**: 

python
- flask
- opencv
- tensorflow
- imagezmq  

## Dependências
- Linguagem: python
- Dependências:
  - usa ambiente anaconda e tensorflow 
  - as dependencias do env estao registradas num ficheiro yml
  - usa imagezmq e opencv
  - usa modelo Deep SORT que precisa de Tensorflow 2.0 e keras

- Dependências de sistema:
  - miniconda

## Como Rodar Localmente
- as api flask dependem do emulator com imagezmq pq precisam das cameras ligadas   
- rodar python video_streamer/video_streamer.py
- rodar python object_counting/app.py

### problemas
 - comunicaçao entre servidor flask e o emulador de camera(ler o artigo) 

### comandos uteis
criar env : conda env create -f path_of_yml_file
deletar env: conda remove -n env_name --all
guardar env: conda env export | grep -v "^prefix: " > environment.yml
instalar com pip: pip install -r requirements.txt
