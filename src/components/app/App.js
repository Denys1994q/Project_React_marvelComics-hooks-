import { Component } from 'react';

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import MarvelService from '../../services/MarvelService';

import decoration from '../../resources/img/vision.png';

import ErrorBoundary from '../errorBoundary/ErrorBoundary';

// ф-ія, в якій збираються всі компоненти разом і відправляються для рендерингу на сторінку в index.js

class App extends Component {
    state = {
        name: '',
        thumbnail: '',
        description: null,
        comics: [],
        key: null,
        loading: false,
        skeleton: true
    }

    marvel = new MarvelService();
    showInfoAboutHero = (id) => {
        this.setState({
            loading: true,
            skeleton: false
        })
        this.marvel.getCharacter(id)
            .then(this.changeHeroInfo)
    }

    changeHeroInfo = ({ name, thumbnail, description, comics, id }) => {
        this.setState({
            name: name,
            thumbnail: thumbnail,
            description: description,
            comics: comics,
            key: id,
            skeleton: false,
            loading: false
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader />
                <main>
                    <ErrorBoundary>
                        <RandomChar />
                    </ErrorBoundary>
                    <div className="char__content">
                    <ErrorBoundary>
                        <CharList showInfoAboutHero={this.showInfoAboutHero} />
                    </ErrorBoundary>
                        <CharInfo activeHero={this.state} />
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </main>
            </div>
        )
    }

}

export default App;