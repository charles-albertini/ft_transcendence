NAME = ft_transcendence

DOCKER_CMD = docker compose
DOCKER_PATH = docker-compose.yml

CERT_PATH = nginx/certificates
CERT_KEY = $(CERT_PATH)/localhost.key
CERT_CRT = $(CERT_PATH)/localhost.crt
CERT_FILES = $(CERT_KEY) $(CERT_CRT)

all: up

up: ${CERT_FILES}
	${DOCKER_CMD} -p ${NAME} -f ${DOCKER_PATH} up -d --build;

down:
	${DOCKER_CMD} -p ${NAME} -f ${DOCKER_PATH} down -v;

stop:
	${DOCKER_CMD} -p ${NAME} -f ${DOCKER_PATH} stop;

start:
	${DOCKER_CMD} -p ${NAME} -f ${DOCKER_PATH} start;

restart:	
	${DOCKER_CMD} -p ${NAME} -f ${DOCKER_PATH} restart;

re: down reload_certs up

reload_certs:
	@rm -f ${CERT_FILES}
	@$(MAKE) -s ${CERT_FILES}

${CERT_FILES}:
	@mkdir -p $(CERT_PATH)
	@openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
		-keyout ${CERT_KEY} -out ${CERT_CRT} \
		-subj "/CN=localhost" \
		-addext "subjectAltName=DNS:localhost"

.PHONY: all up down stop start restart re reload_certs