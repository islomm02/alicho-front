export interface AiRequestsType{
  company_id: number,
    model_name: string,
    input_tokens: number,
    output_tokens: number,
    total_cost: number,
    created_at: string
}


export interface UserType{
  id:number,
  name: string,
  image:string,
  email:string
}