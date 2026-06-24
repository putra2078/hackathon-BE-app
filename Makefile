help:
	@echo "Available commands:"
	@echo "make install"
	@echo "make start"
	@echo "make stop"

install:
	npm install

	
start:
	cd cmd && node main.js

	
stop:
	pkill -f node

migrate-dev:
	npx prisma migrate dev --name $(ARGS)

