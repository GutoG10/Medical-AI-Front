# Instruções para interação com o server e deploy

## Copiar arquivos do computador local para o servidor

```sh
scp -r [ARQUIVO] root@72.61.133.25:~/[] # path do local no server
```

## Rebuild caddy

Caso precise reiniciar o caddy por algum motivo:

```sh
docker run -d --name caddy --restart unless-stopped \
  --network edge \
  -p 80:80 -p 443:443 \
  -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile:ro \
  -v caddy_data:/data -v caddy_config:/config \
  caddy:2.8
```

**OBS**: O parâmetro `network` é importante. Ver as instruções de deploy do front.

## Deploy front-end

### 1. Conectar ao servidor

```sh
ssh ssh://root@72.61.133.25
```

### 2. Parar o container atual

```sh
docker ps # lista os conatiners atuais
docker stop [ID DO CONTAINER DO FRONT]
docker rm [ID DO CONTAINTER DO FRONT]
```

### 3. Remover a imagem do front

```sh
docker image ls # lista as imagens atuais
docker rmi [ID DA IMAGEM DO FRONT]
```

Caso ocorrer um erro como este:

```
Error response from daemon: conflict: unable to delete 7da8522a8318 (cannot be forced) - image is being used by running container 32136d4738ee
```

Delete o container que está em depêndencia:

```sh
docker rm 32136d4738ee
docker rmi [ID DA IMAGEM DO FRONT]
```

Repita o processo até a imagem do front ser deletada com sucesso.

### 4. Fazer o build da imagem

```sh
cd ~/Medical-AI-Front/ # atualmente é este o diretório do front
docker build --no-cache -t medical-ai-front .
```

### 5. Coloque a imagem em execução novamente

```sh
docker run -d --name medical-ai-front \
  --network edge \
  --restart unless-stopped \
  -p 8080:8080 \
  medical-ai-front:latest 
```

**OBS**: A flag `--network edge` está setando uma network `edge`, que é compartilhada pelo Caddy (imagem que disponibilza o certificado SSL). O caddy e o front precisam **estar na mesma network**.

