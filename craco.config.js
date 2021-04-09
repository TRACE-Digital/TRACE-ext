module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' &&
                    require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                    content_script: './src/content_script.js',
                    window_hook: './src/window_hook.js',
                    background_script: './src/background_script.js',
                    dialog: './src/dialog.js',
                    Login: './src/Login.js',
                    amplify_config: './src/amplify_config.js',
                    options: './src/options.js'
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        },
    }
}
