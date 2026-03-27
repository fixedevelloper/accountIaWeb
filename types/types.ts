export interface Message {
    id?: number;
    user_id?: number;
    text: string;
    type: "user" | "ai";
    created_at?: string;
}
interface Journal {
    id:number;
    name:string;
    code:string;
    company?: Company;
}

export interface JournalEntry {
    id: number;
    company_id: number;
    document_id: number | null;
    journal_id: number;
    reference: string;
    entry_date: string; // date ISO
    status: string;

    company?: Company;
    journal?: Journal;
    document?: Document;
    lines: JournalEntryLine[];

    created_at: string;
    updated_at: string;
}

interface Account {
    id:number;
    code: string;
    name: string;
}

export interface JournalEntryLine {
    id: number;
    entry_id: number;
    account_id: number;
    debit: number;
    credit: number;
    description: string;

    account: Account;
    tax_lines: TaxLine[];

    created_at: string;
    updated_at: string;
}
export interface TaxLine {
    id: number;
    entry_line_id: number;
    tax_id: number | null;
    amount: number;

    // éventuellement
    tax_rate?: number;
    created_at: string;
    updated_at: string;
}

interface Company {
    id:number;
    name: string;
}

interface Partner {
    id:number;
}

interface DocumentVersion {
    id:number;
}

interface AiClassification {
    id:number;
}

export interface Document {
    id: number;
    type: string;
    status: string;
    file_path?: string;
    file_url?: string;

    company_id: number | null;
    partner_id: number | null;

    company?: Company;
    partner?: Partner;
    versions?: DocumentVersion[];
    extractions?: DocumentExtraction[];
    latest_extraction?:DocumentExtraction;
    ai_classifications?: AiClassification[];
    journal_entries?: JournalEntry[];

    created_at: string;
    updated_at: string;
}
export interface DocumentExtraction {
    id: number;
    document_id: number;

    type_document?: string;
    supplier_name?: string;
    client_name?: string;

    category?: string;
    invoice_number?: string;
    invoice_date?: string; // date ISO
    due_date?: string;
    payment_status?: string;

    amount_ht: number;
    vat_amount: number;
    total_amount: number;
    formatted_total: string;

    currency: string;

    confidence: number;
    status: string;
    status_label: string;

    raw_json: Record<string, any>;

    is_validated: boolean;
    is_complete: boolean;
    is_valid: boolean;
    vat_rate: number | null;

    created_at: string;
    updated_at: string;
}
export type StatusType = 'draft' | 'pending' | 'validated' | 'paid';

export interface Entry {
    id: number;
    date?: string;
    account?: string;
    label?: string;
    debit?: number | string;
    credit?: number | string;
    status: StatusType;
}