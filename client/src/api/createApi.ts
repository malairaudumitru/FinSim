import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiClient } from './types'

export function createApi(client: AxiosInstance): ApiClient {
    const requestHandler = async <T>(
        request: () => Promise<AxiosResponse<T>>
    ): Promise<T> => {
        const res = await request()
        return res.data
    }

    return {
        get: (url, config) =>
            requestHandler(() => client.get(url, config)),

        post: (url, data, config) =>
            requestHandler(() => client.post(url, data, config)),

        put: (url, data, config) =>
            requestHandler(() => client.put(url, data, config)),

        patch: (url, data, config) =>
            requestHandler(() => client.patch(url, data, config)),

        delete: (url, config) =>
            requestHandler(() => client.delete(url, config)),

        uploadFile: (url, formData, config) =>
            requestHandler(() =>
                client.post(url, formData, {
                    ...config,
                    headers: {
                        ...(config?.headers || {}),
                        'Content-Type': 'multipart/form-data',
                    },
                })
            ),
    }
}
