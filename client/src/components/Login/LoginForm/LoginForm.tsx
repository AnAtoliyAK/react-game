import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@material-ui/core';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

import './LoginForm.scss';
import { User } from '../../../shared/interfaces';
import { useStore } from '../../../hooks/hooks';
import { DEFAULT_FIELD_STYLE, FIELD_SIZES } from '../../../constants';

const LoginForm = observer(() => {
    const authStore = useStore('authStore');
    const gameStore = useStore('gameStore');
    const gameSettingsStore = useStore('gameSettingsStore');

    const getSettings = async () => {
        console.log('sss');
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
                // gameStore.setDefaultStartGameValues(
                //     gameSettingsStore.gameSettings.fieldHeight,
                //     gameSettingsStore.gameSettings.fieldWidth,
                //     gameSettingsStore.gameSettings.bombsQuantity,
                // );
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
                    // setDefaultSettings();
                }
                const lastSavedGame = response.data.list[0].savedGame;
                const lastGameTime = response.data.list[0].gameTime;
                const lastGameBombsCount = response.data.list[0].bombsCount;
                gameStore.setCells(lastSavedGame);
                gameStore.setGameTime(lastGameTime);
                gameStore.setBombCount(lastGameBombsCount);
                // gameStore.setDefaultStartGameValues(
                //     gameSettingsStore.gameSettings.fieldHeight,
                //     gameSettingsStore.gameSettings.fieldWidth,
                //     gameSettingsStore.gameSettings.bombsQuantity,
                // );
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
                    },
                },
                {
                    headers: {
                        authorization: authStore.token,
                    },
                },
            )
            .then((response) => {
                // sendRequest();
                // mainScreenStore.toggleIsNewTaskFormOpen();
            });
        //TODO
        // gameSettingsStore.setGameSettings({
        //     fieldSize: FIELD_SIZES.SMALL.name,
        //     fieldWidth: FIELD_SIZES.SMALL.fieldWidth,
        //     fieldHeight: FIELD_SIZES.SMALL.fieldHeight,
        //     bombsQuantity: FIELD_SIZES.SMALL.bombsQuantity,
        //     fieldStyle: DEFAULT_FIELD_STYLE,
        // });
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
        </div>
    );
});

export default LoginForm;
