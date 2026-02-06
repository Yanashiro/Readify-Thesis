.PHONY: dev backend frontend stop

dev: backend frontend

backend:
	@node src/Index.js &

frontend:
	@npm run dev &

stop:
	@lsof -t -i :5000 | xargs kill 2>/dev/null; true
	@lsof -t -i :5173 | xargs kill 2>/dev/null; true
	@echo "Servers stopped"
