import { useEffect, useRef, useState} from "react";
import Image from "next/image";
import {AppShell} from "@/components/app-shell/app-shell";
import styles from '../styles/Home.module.css';
import {defaultQueryFn} from "@/lib/api-hooks";

export default function Home({photos}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPhotos, setSearchPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [element, setElement] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    const search = async () => {
        try {
            setLoading(true);
            const res = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}&page=${page}&per_page=12`)
            setSearchPhotos(photos => {
                return [...photos, ...res.results]
            });
            setLoading(false);
        } catch (e) {
            console.log({e});
            setLoading(false);
        }
    }

    useEffect(() => {

        if (searchTerm) {
            search();
            console.log(searchTerm)
        }

    }, [searchTerm, page]);

    useEffect(() => {
        setSearchPhotos(photos);
    }, []);

    useEffect(() => {
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!loading) {
                    setPage(oldPage => oldPage + 1);
                }
            }
        }, {threshold: 0})
    }, []);

    useEffect(() => {
        const currentElement = element;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        }
    }, [element]);

    return (
        <AppShell title={'Create Next App'} search={searchTerm => setSearchTerm(searchTerm)}>
            {searchPhotos.length && (
                <>
                    <section className={styles.main__content}>
                        {searchPhotos.map(photo => {
                            return (
                                <figure key={photo.id + photo}>
                                    <Image
                                        src={photo.urls.regular}
                                        alt={photo.alt_description}
                                        width={photo.width}
                                        height={photo.height}
                                        loading="eager"
                                    />
                                </figure>
                            )
                        })}
                    </section>
                </>
            )}
            <div ref={setElement} style={{height: 1}}/>
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
