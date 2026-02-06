.PHONY: dev backend frontend

dev: backend frontend

backend:
	@node src/Index.js &

frontend:
	@npm run dev &
