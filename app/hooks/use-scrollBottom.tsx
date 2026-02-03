export const scrolltoBottom = (ref: any) => {
    (ref?.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth', block: 'end' });
}