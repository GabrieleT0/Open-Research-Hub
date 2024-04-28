# NEOLAiA-HUB

# How to contribute

## Requirements
- Docker
- VSCode (with Database client extension to see data in the DB)

## Installation
### Back-end
1. Clone this repository:
```
git clone https://github.com/isislab-unisa/NEOLAiA-hub.git
```

2. Install dev container in vscode. 
3. Create .env in .devcontainer directory and follow .env.example for the creation
3. Re-open project in dev-container (click blue icon at the bottom left of vscode)
8. For configure the vscode DB client extension use the following parameters:
Host: 127.0.0.1
Port: 5432
user: admin
pwd: admin
db-name: neolaia-hub
4. Configure appropriately the .env file in the neolaia-hub
5. Install npm dependency:
```
cd neolaia-hub
npm install
```
6. Create the .env file and complete with all field (see .env.example)

7. Run strapi from the neolaia-hub directory:
```
npm run develop
```

---

### Front-end
1. Move to the front-end directory (./front-end/neolaia-hub)
2. Run 
```
npm install
```
3. Start the front-end with
```
npm start
```