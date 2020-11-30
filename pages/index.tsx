import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {AppShell} from "@/components/app-shell/app-shell";
import styles from '../styles/Home.module.css';
import {defaultQueryFn} from "@/lib/api-hooks";

export default function Home({photos}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPhotos, setSearchPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const search = useCallback(async (searchTerm: string) => {
        try {
            setSearchTerm(searchTerm);
            const res = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}`)
            setSearchPhotos(res.results);
            setTotalPages(res.total_pages);
            console.log(totalPages)
        } catch (e) {
            console.log({e})
        }
    }, []);

    const nextPage = () => {
        setPage(oldPage => oldPage + 1);
    }

    useEffect(() => {
        async function nextPage() {
            const res = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}&page=${page}`)
            setSearchPhotos(oldPhotos => [...oldPhotos, ...res.results]);
        }

        nextPage();
    }, [page])

    useEffect(() => {
        setSearchPhotos(photos);
    }, [])

    return (
        <AppShell title={'Create Next App'} search={searchTerm => search(searchTerm)}>
            {searchPhotos.length && (
                <section className={styles.main__content}>
                    {searchPhotos.map(photo => {
                        return (
                            <figure key={photo.id + photo}>
                                <Image
                                    src={photo.urls.regular}
                                    alt={photo.alt_description}
                                    width={photo.width}
                                    height={photo.height}
                                />
                            </figure>
                        )
                    })}
                    {totalPages > 1 && (
                        <button onClick={() => nextPage()}>Next</button>
                    )}
                </section>
            )}
        </AppShell>
    )
}

export async function getStaticProps() {
    const data = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&page=1&per_page=12`)
    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            photos: data
        }
    }
}
