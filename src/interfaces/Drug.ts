export interface DrugInterface{
    drug_inventory_id: number;
    dose: number;
    equivalent_daily_dose: number;
    frequency: string;
    start_date: string;
    auto_expire_date: string;
    instructions: string;
    units: string;
}