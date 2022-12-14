import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

import InputText from '../../components/InputText/InputText';
import Button from '../../components/Button/Button';
import InputRange from '../../components/InputRange/InputRange';

import './Result.css';
import { clearError, generateImages } from '../../features/images/imagesSlice';
import Option from '../../components/Option/Option';
import DownloadButton from '../../components/DownloadButton/DownloadButton';
import SearchHistory from '../../components/SearchHistory/SearchHistory';
import { clearSearchHistory } from '../../features/images/imagesSlice';
import Error from '../../components/Error/Error';
import { openSlideshow } from '../../features/slideshow/slideshow';

const Result = () => {
    const resultImages = useSelector(state => state.images.current);
    const searchHistory = useSelector(state => state.images.searchHistory);
    const errorObj = useSelector(state => state.images.error);
    const status = useSelector(state => state.images.status);
    const [searchParams, setSearchParams] = useSearchParams();

    const dispatch = useDispatch();

    const { handleSubmit, register, watch, control } = useForm({
        defaultValues: {
            'prompt': searchParams.get('prompt'),
            'resolution': searchParams.get('resolution'),
            'nOfImages': 4
        }
    });

    //On Component Mount
    useEffect(
        () => {
            window.scrollTo(0,0);//scroll to top of page
            const {prompt, resolution, nOfImages} = watch();
            if(prompt && resolution && nOfImages){
                //dispatch(generateImages({prompt, resolution, nOfImages: parseInt(nOfImages)}));
            }
        },
        []
    )

    const onSubmit = (data) => {
        if(data){
            const{prompt, resolution, nOfImages} = data;
            setSearchParams({prompt, resolution});//updating url query strings
            dispatch(generateImages({prompt, resolution, nOfImages: parseInt(nOfImages)}));
        }
    }

    const clearHistory = () => {
        dispatch(clearSearchHistory());
    }

    const openImgInSlideshow = (images, index) => {
        dispatch( openSlideshow({images, index}) )
    }

    const renderResultImages = () => {
        if(status === 'loading'){
            return [...Array(watch('nOfImages'))].map( (loader, i) => {
                return (
                    <div className="result__main__content__items__item" key={i}>
                        <div className="result__main__content__items__item__inner">
                            <div className="result__main__content__items__item__loader">
                            </div>
                        </div>
                    </div>
                )
            } )
        }
        else{
            return resultImages.map( (img, i) => {
                return (
                    <div className="result__main__content__items__item" key={i}>
                        <div className="result__main__content__items__item__inner">
                            <img className="result__main__content__items__item__img" src={img.url} onClick={()=>openImgInSlideshow(resultImages, i)}/>
                        </div>
                    </div>
                )
            })
        }
    }

    const renderErrorComponent = () => {
        const {message} = errorObj;
        if(message){
            return (
                <Error
                    errorObj={errorObj}
                    clearError={()=>dispatch(clearError())}
                />
            )
        }
    }

    return (
        <div className="result">
            <div className="result__inner">
                <section className="result__main">
                    <div className="result__main__inner">
                        <div className="result__main__error-message">
                            <div className="result__main__error-message__inner">
                                {renderErrorComponent()}
                            </div>
                        </div>
                        <div className="result__main__form">
                            <div className="result__main__form__inner">
                                <form className="result__main__form__element" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="result__main__form__element__inner">
                                        <div className="result__main__form__element__input">
                                            <div className="result__main__form__element__input__inner">
                                                <InputText
                                                    register={register}
                                                    name="prompt"
                                                    value={watch("prompt")}
                                                />
                                            </div>
                                        </div>
                                        <div className="result__main__form__element__resolution">
                                            <div className="result__main__form__element__resolution__inner">
                                                <Controller
                                                    control={control}
                                                    name="resolution"
                                                    render={ ({field: {onChange, value}})=> (
                                                        <Option
                                                            label="Choose resolution size"
                                                            value={value}
                                                            setValue={onChange}
                                                            options={['256x256', '512x512', '1024x1024']}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="result__main__form__element__slider">
                                            <div className="result__main__form__element__slider__inner">
                                                <InputRange
                                                    name="nOfImages"
                                                    value={watch('nOfImages')}
                                                    label="Number of images to generate"
                                                    minValue="1"
                                                    maxValue="4"
                                                    register={register}
                                                    
                                                />
                                            </div>
                                        </div>
                                        <div className="result__main__form__element__submit">
                                            <div className="result__main__form__element__submit__inner">
                                                <Button
                                                    variant="filled"
                                                    text="Generate Image(s)"
                                                    loader={true}
                                                    status={status}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="result__main__content">
                            <div className="result__main__content__inner">
                                <div className="result__main__content__heading">
                                    <div className="result__main__content__heading__inner">
                                        <h1 className="heading heading_small">
                                            RESULTS
                                        </h1>
                                    </div>
                                </div>
                                {/* 
                                <div className="result__main__content__download-btn" onClick={downloadImages}>
                                    <div className="result__main__content__download-btn__inner">
                                        <DownloadButton
                                            status={status}
                                            images={resultImages}
                                            label="Download All Images"
                                            variant="text-icon"
                                        />
                                    </div>
                                </div>
                                */}
                                <div className="result__main__content__items">
                                    <div className="result__main__content__items__inner">
                                        {renderResultImages()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                        /*        
                        <div className="result__main__attribution">
                            <div className="result__main__attribution__inner">
                                <div>
                                    Powered by Dall-E 2
                                </div>
                            </div>
                        </div>
                        */
                        }
                    </div>
                </section>
                <section className="result__sidebar">
                    <div className="result__sidebar__inner">
                        <div className="result__sidebar__heading">
                            <div className="result__sidebar__heading__inner">
                                <div className="result__sidebar__heading__title">
                                    <div className="result__sidebar__heading__title__inner">
                                        <div>
                                            Recent
                                        </div>
                                    </div>
                                </div>
                                <div className="result__sidebar__heading__clear-btn">
                                    <div className="result__sidebar__heading__clear-btn__inner">
                                        <Button
                                            type={'button'}
                                            text={"Clear"}
                                            variant={'ui'}
                                            size={'small'}
                                            onClick={clearHistory}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="side-bar__content">
                            <div className="side-bar__content__inner">
                                <SearchHistory
                                    history={searchHistory}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Result;