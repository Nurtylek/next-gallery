import {useState} from "react";

export const defaultQueryFn = (input: RequestInfo, init?: RequestInit) =>
    fetch(input, {
        ...init,
        headers: {
            'Accept-Version': 'v1'
        }
    }).then((res) => {
        if (res.status >= 300) {
            throw res;
        }
        return res.json();
    });

