import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/errorMessage'

// ПОКАЗУЄМО РАНДОМНОГО ПЕРСОНАЖА НА СТОРІНЦІ ((при оновленні сторінки персонаж міняється))
// Алгоритм: 
// 1. Звертаємося до сервера по дані персонажа
// - компонент MarvelService: відповідає за надсилання fetch запитів на сервер. Ф-ія getCharacter
// 2. Обробляємо дані як нам треба 
// - компонент MarvelService: Ф-ія _transformCharacter, включена в getCharacter
// 3. Виводимо дані на сторінку (ДАНІ ЙДУТЬ В STATE, А ЗІ STATE У ВЕРСТКУ)
// Компонент RandomChar:
// Надсилаємо запит (updateHero), зберігаємо відповідь у state, в залежності від відповіді показуємо один із state
// - є три різні свойства state: char (показує верстку персонажа), loading (показує верстку спінера із загрузкою), error (показуємо верстку з помилкою)

class RandomChar extends Component {
    state = {
        char: {},
        loading: true, // запустили сторінку, відразу пішов спінер (бо стоїть тру)
        error: false // вивести повідомлення про помилку (відразу фолс)
    }

    // ф-я для запису об'єкту в state 
    onCharLoaded = (char) => {
        this.setState({ 
            char, 
            loading: false, // отримали дані з серверу, значить ставимо спінер в false
            error: false 
        }) 
    }

    // ф-ія для виведення помилки 
    onError = () => {
        this.setState({ 
            loading: false,
            error: true 
        })
    }

    marvelServiceItem = new MarvelService(); 
    updateHero = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelServiceItem
            .getCharacter(id) // отримали потрібний об'єкт
            .then(this.onCharLoaded) // викликали ф-ію, яка записала цей об'єкт в state. Проміс йде автоматично як аргумент в onCharLoaded    
            .catch(this.onError)
    }

    componentDidMount() {
        this.updateHero();
        <View/>
        // this.changeHero();
    }

    changeHero = () => {
        this.setState({
            loading: true,
            error: false
        })
        this.updateHero();
    }

    render() {
        const { char, loading, error } = this.state;

        const errorMessage = error ? <ErrorMessage /> : null; // або null або кусок верстки, яка потрібна 
        const spinner = loading ? <Spinner /> : null; // або null або кусок верстки, яка потрібна 
        const content = !(loading || error) ? <View char={char} /> : null; // або null або кусок верстки, яка потрібна 

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={this.changeHero}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki } = char
    const noImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className={thumbnail === noImage ? 'randomchar__imgNo' : 'randomchar__img'} />
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
}

export default RandomChar;