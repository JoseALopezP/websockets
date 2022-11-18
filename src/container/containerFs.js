const fs = require('fs');

class Container {
    constructor(name){
        this.name = name;
    }

    async save(object) {
        const file = await fs.promises.readFile(this.name, 'utf-8');
        const parsed = JSON.parse(file);
        let id = 1;
        parsed.forEach((element, index) => {
        if (element.id >= id) {
            id = element.id + 1;
        }
        });
        object.id = id;
        parsed.push(object);
        await fs.promises.writeFile(this.name, JSON.stringify(parsed, null, 2));
        return id;
    }

    async getById(id){
        const file = await fs.promises.readFile(this.products, 'utf-8');
        const parsed = JSON.parse(file);
        let selectedObject = null;
        parsed.forEach(element => {
        if (element.id == id) {
            selectedObject = element;
        }
        });
        return selectedObject;
    }

    async getAll() {
        const file = await fs.promises.readFile(this.name, 'utf-8');
        const parsed = JSON.parse(file);
        return parsed;
    }

    async deleteById(id) {
        const file = await fs.promises.readFile(this.name, 'utf-8');
        const parsed = JSON.parse(file);
        let selectedIndex = -1;
        parsed.forEach((element, index) => {
        if (element.id == id) {
            selectedIndex = index;
        }
        });
        if (selectedIndex != -1) {
            parsed.splice(selectedIndex, 1);
            await fs.promises.writeFile(this.name, JSON.stringify(parsed, null, 2));
        }
    }

    async deleteAll() {
        const arr = [];
        await fs.promises.writeFile(this.name, JSON.stringify(arr, null, 2));
    }

}

module.exports = Container;