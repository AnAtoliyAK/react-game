import './LoginForm.scss';

import { Button, TextField } from '@material-ui/core';
import { DEFAULT_FIELD_STYLE, DEFAULT_FOREIGN_LANGUAGE, DEFAULT_SOUND_VOLUME, FIELD_SIZES } from '../../../constants';
import { GameStatistics, User } from '../../../shared/interfaces';
import React, { useState } from 'react';

import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import axios from 'axios';
import { generateCells } from '../../../utils';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useForm } from 'react-hook-form';
import { useStore } from '../../../hooks/hooks';

const LoginForm = observer(() => {
    const authStore = useStore('authStore');
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');
    const gameStatisticsStore = useStore('gameStatisticsStore');

    const [errorMessage, setErrorMessage] = useState('');

    const getSettings = async () => {
        axios
            .get('/api/settings', {
                headers: {
                    authorization: authStore.token,
                },
            })
            .then((response) => {
                if (!response.data) {
                    setDefaultSettings();
                } else gameSettingsStore.setGameSettings(response.data.list[0]);
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };

    const getLastGame = async () => {
        axios
            .get('/api/gamesave', {
                headers: {
                    authorization: authStore.token,
                },
            })
            .then((response) => {
                if (!response.data) {
                    gameStore.setDefaultStartGameValues(
                        gameSettingsStore.gameSettings.fieldHeight,
                        gameSettingsStore.gameSettings.fieldWidth,
                        gameSettingsStore.gameSettings.bombsQuantity,
                    );
                    setDefaultSavedGame();
                } else {
                    const lastSavedGame = response.data.list[0].savedGame;
                    const lastGameTime = response.data.list[0].gameTime;
                    const lastGameBombsCount = response.data.list[0].bombsCount;
                    gameStore.setCells(lastSavedGame);
                    gameStore.setGameTime(lastGameTime);
                    gameStore.setBombCount(lastGameBombsCount);
                }
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };

    const getStatistics = async () => {
        axios
            .get('/api/statistics', {
                headers: {
                    authorization: authStore.token,
                },
            })
            .then((response) => {
                const responseStatistics = response.data.map((el: { list: GameStatistics[] }) => el.list[0]);
                gameStatisticsStore.setGameStatistics(responseStatistics);
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };
    //TODO
    const setDefaultSettings = () => {
        axios
            .post(
                'api/settings',
                {
                    list: {
                        fieldSize: FIELD_SIZES.SMALL.name,
                        fieldWidth: FIELD_SIZES.SMALL.fieldWidth,
                        fieldHeight: FIELD_SIZES.SMALL.fieldHeight,
                        bombsQuantity: FIELD_SIZES.SMALL.bombsQuantity,
                        fieldStyle: DEFAULT_FIELD_STYLE,
                        gameSoundVolume: DEFAULT_SOUND_VOLUME,
                        gameMusicVolume: DEFAULT_SOUND_VOLUME,
                        gameLanguage: DEFAULT_FOREIGN_LANGUAGE,
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .then((response) => {
                gameSettingsStore.setGameSettings(response.data.list[0]);
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };

    const setDefaultSavedGame = () => {
        const savedGame = generateCells(
            FIELD_SIZES.SMALL.fieldWidth,
            FIELD_SIZES.SMALL.fieldHeight,
            FIELD_SIZES.SMALL.bombsQuantity,
        );
        const bombsCount = FIELD_SIZES.SMALL.bombsQuantity;
        const gameTime = 0;
        axios
            .post(
                'api/gamesave',
                {
                    list: {
                        savedGame: savedGame,
                        bombsCount: bombsCount,
                        gameTime: gameTime,
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };

    const { register, handleSubmit, errors } = useForm<User>();
    const onSubmit = (data: User) => {
        axios
            .post('api/auth/login', {
                email: data.email,
                password: data.password,
            })
            .then((response: { data: { token: string } }) => {
                authStore.setToken(response.data.token);
                authStore.setIsAuth(true);
                getSettings();
                getLastGame();
                getStatistics();
            })
            .catch((er) => {
                console.log('error: ', er.message);
                setErrorMessage(er.message);
            });
    };
    return (
        <div>
            Login
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <TextField
                        id="name"
                        size="small"
                        name="email"
                        error={errors.email && true}
                        autoComplete="false"
                        label="Write your email here"
                        variant="outlined"
                        inputRef={register({ required: true })}
                    />
                    {errors.email && errors.email.type === 'required' && (
                        <div className="error">Your must enter email!.</div>
                    )}
                </div>
                <div className="field">
                    <TextField
                        id="password"
                        size="small"
                        name="password"
                        type="password"
                        error={errors.password && true}
                        autoComplete="false"
                        label="Write your password here"
                        variant="outlined"
                        inputRef={register({ required: true })}
                    />
                    {errors.password && errors.password.type === 'required' && (
                        <div className="error">Your must enter your password.</div>
                    )}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="submit"
                    startIcon={<ExitToAppTwoToneIcon />}
                >
                    Login
                </Button>
            </form>
            <div className="error-message">{errorMessage}</div>
        </div>
    );
});

export default LoginForm;
