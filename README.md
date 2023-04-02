# Tombadinhos

> Em progresso

Projeto aberto para catalogar, buscar e visualizar bens tombados em Recife.

## Metas

1. ~~API para full text search e inserção de dados~~
2. Permitir a sugestão de alterações das informações de um edifício
3. Pensar em uma forma confiável e prática para especialistas aceitarem
   e refinarem sugestões.
4. Linkar com APIs externas com mídia, como twitter e instagram, talvez
   com campos tipo `twitterHashtags` e `instagramHashtags`
5. Melhorar as visualizações com o mapa

## Getting Started

Necessário:
- Docker 20
- Docker compose version 2.16
- Node 18.15

1. Rode o elastic search e espere serviço ficar healthy:

```bash
docker compose up --wait es01
```

2. ** Altere as permissões de config/* **
Esse passo é temporário até configurar as permissões dos volumes corretamente (passando owner
para um id de usuário comum entre o host e os containers)

```bash
chown -R $USER:$USER ./config
```


3. Rode o servidor:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu browser.

## Histórico

Esse repo é um fork [desse outro](https://github.com/vitorcodesalittle/atlas), onde eu estava tentando usar apenas o SSR do React 18.
Uma hora percebi que seria muito mais fácil usar Next 13, então refiz o projeto nesse framework.
