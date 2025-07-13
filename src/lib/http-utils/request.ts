'use client'

export async function get(url: string, params?: Record<string, string>) {
    const queryString = new URLSearchParams({
        ...params,
    }).toString()
    const res = await fetch(`${url}?${queryString}`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
    }
    const data = await res.json()
    return data
}

export async function post(url: string, data: unknown) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
    }
    const resData = await res.json()
    return resData
}

    export async function put(url: string, data: unknown) {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
    }
    const resData = await res.json()
    return resData
}

export async function del(url: string) {
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
    }
    const resData = await res.json()
    return resData
}