export interface DrugOrder{
    drug_inventory_id: number;
    dose: string;
    equivalent_daily_dose: string;
    frequency: number;
    start_date: string;
    auto_expire_date: string;
    instructions: string;
    units: string;
}