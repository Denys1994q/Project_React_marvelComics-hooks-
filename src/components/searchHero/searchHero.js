// стилі і квартинки 
import './searchHero.css';
import Spinner from '../spinner/Spinner';
// хуки
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

// щоб анімація на окремій сторінці персонажа 

const SearchHero = () => {
    // запит на сервер
    const { loading, getCharacterByName } = useMarvelService();
    // елементи верстки 
    const [message, setMessage] = useState('');
    const [activeHero, setActiveHero] = useState('');
    const [show, setShow] = useState(false); // для анімації
    const [messageBlock, setMessageBlock] = useState(false);
    
    // сервер 
    const showValue = (value) => {
        setShow(false) 
        setMessageBlock(true)
        getCharacterByName(value.heroName)
            .then(changeState)
    }
    const changeState = (res) => {
        if (res !== undefined) {
            setMessage(`There is! Visit ${res.name} page`)
            setActiveHero(res.name)
        } else {
            setMessage('The character was not found. Check the name and try again')
        }
        setShow(true)
    }

    return (
        <div className="formWrapper">
            <Formik
                initialValues={{
                    heroName: ''
                }}
                validationSchema={Yup.object({
                    heroName: Yup.string().required('This field is required'),
                })}
                onSubmit={values => showValue(values)}>
                <Form >
                    <label className='labelInp' htmlFor="enterName">Or find a character by name:</label>

                    <div className='inp-wrapper' >
                    <Field id='enterName' name='heroName' type='text' placeholder='Enter name' className='inp' />
                    {loading ? <><Spinner/></> : <><Field type="submit" className='sub' value='find' /></>}
                    </div>    
                    <ErrorMessage className='error' name='heroName' component='div' />

                    {messageBlock ? 
                           <CSSTransition in={show} timeout={3500} >
                           <div className='innerBtn'>
                               <div className={message == 'The character was not found. Check the name and try again' ? 'message-err' : 'message'} >
                                   {message}
                               </div>
                               {message !== 'The character was not found. Check the name and try again' && message !== '' ? <AddBtn activeHero={activeHero} /> : null}
                           </div>
                           </CSSTransition>  
                     : null}
                           
                    
                </Form>
            </Formik>
        </div>
    )
}

const AddBtn = (props) => {
    return (
        <Link to={`/characters/${props.activeHero}`} className="button button__secondary">
            <div className="inner">to page</div>
        </Link>
    )
}

export default SearchHero;