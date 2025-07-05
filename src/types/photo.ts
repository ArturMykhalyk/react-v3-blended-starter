interface Src{
    large: string;
    original: string;
}
export interface Photo {
    id: number;
    avg_color: string;
    alt: string;
    src: Src;
}
