import {useHttp} from '../hooks/http.hooks';

// загальна ф-ія, яка відправляє запити 
// - запит для отримання всіх персонажів разом
// - запит для отримання одного персонажа
// допоміжна ф-ія, яка коригує отримані дані (відрізає непотрібну дату)

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=d958623270bfcc1cdb0952691b682b77';
    const startNum = 210;
    
    // ф-я щоб отримати всіх персонажів 
    // startOpt - з якого номеру почати показувати героїв
    const getAllCharacters = async (startOpt = startNum) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${startOpt}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    // ф-я щоб отримати одного персонажа  
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); // вся відповідь
        return _transformCharacter(res.data.results[0]) // відповідь, трансформована в такий об'єкт як треба (без всього лишнього)
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`); 
        if (res.data.total > 0) {
            return _transformCharacter(res.data.results[0]) 
        } else {
            return
        }
    }

    // допоміжна ф-ія, щоб в результаті відповіді сформувати такий об'єкт, як нам треба (відкинути все лишнє, що є у відповіді) 
    const _transformCharacter = (hero) => {
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

    const startNumComics = 8;
    const getComics = async (start = startNumComics) => {
        const res = await request(`https://gateway.marvel.com:443/v1/public/comics?limit=8&offset=${start}&apikey=d958623270bfcc1cdb0952691b682b77`);
        console.log(res)
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`https://gateway.marvel.com:443/v1/public/comics/${id}?apikey=d958623270bfcc1cdb0952691b682b77`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            description: comics.description,
            pages: comics.pageCount,
            languages: comics.textObjects[0] ?  comics.textObjects[0].language : 'Languages: none',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            title: comics.title,
            price: comics.prices[0].price
        }
    }

    return {
            getAllCharacters, 
            getCharacter, 
            getCharacterByName, 
            clearError, 
            getComics, 
            getComic, 
            process,
            setProcess}
}

export default useMarvelService;