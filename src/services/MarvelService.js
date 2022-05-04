// загальна ф-ія, яка відправляє запити 
// - запит для отримання всіх персонажів разом
// - запит для отримання одного персонажа
// допоміжна ф-ія, яка коригує отримані дані (відріщає непотрібну дату)

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=d958623270bfcc1cdb0952691b682b77';
    startNum = 210;
    num = 9;
    
    // загальна ф-я по отриманню даних з сервера 
    getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error('Помилка')
        }
        return await res.json();
    }

    // ф-я щоб отримати всіх персонажів 
    // startOpt - з якого номеру почати показувати героїв
    // num - по скільки героїв показувати 
    getAllCharacters = async (startOpt = this.startNum, num = this.num) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=${num}&offset=${startOpt}&${this._apiKey}`);
        
        return res.data.results.map(this._transformCharacter)
    }
    // ф-я щоб отримати одного персонажа  
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); // вся відповідь
        return this._transformCharacter(res.data.results[0]) // відповідь, трансформована в такий об'єкт як треба (без всього лишнього)
    }

    // допоміжна ф-ія, щоб в результаті відповіді сформувати такий об'єкт, як нам треба (відкинути все лишнє, що є у відповіді) 
    _transformCharacter = (hero) => {
        return {
            id: hero.id,
            name: hero.name,
            description: hero.description == '' ? 'no info' : hero.description.slice(0, 210),
            thumbnail: hero.thumbnail.path + '.' + hero.thumbnail.extension,
            homepage: hero.urls[0].url,
            wiki: hero.urls[1].url,
            comics: hero.comics.items,
        }
    }

}

export default MarvelService;