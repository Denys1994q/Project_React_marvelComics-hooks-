import AppHeader from "../appHeader/AppHeader";
import { MainPage, ComicsPage, Page404, SinglePage, SingleComicLayout, SingleCharacterLayout } from '../pages';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ф-ія, в якій збираються всі компоненти разом і відправляються для рендерингу на сторінку в index.js

const App = () => {
    // тут кажемо: цей компонент доступний за такою адресою. Далі клік на лінк, який веде туди. 
    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>
                    <Routes>
                        <Route path='/' element={<MainPage />} />
                        <Route path='/characters' element={<MainPage />} />
                        <Route path='/characters/:id' element={<SinglePage Component={SingleCharacterLayout} dataType='character' />} />
                        <Route path='/comics' element={<ComicsPage />} />
                        <Route path='/comics/:id' element={<SinglePage Component={SingleComicLayout} dataType='comic' />} />
                        <Route path='*' element={<Page404 />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;