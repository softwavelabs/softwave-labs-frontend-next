export interface QuoteChild {
    type: string;
    text: string;
}

export interface QuoteNode {
    type: string;
    children: QuoteChild[];
}
