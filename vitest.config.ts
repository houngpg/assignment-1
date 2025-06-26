import vitestOpenapiPlugin from './vitest-openapi-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: ["./build", "./client"]
    },
    plugins: [
        {
            ...vitestOpenapiPlugin
        }
    ]
})