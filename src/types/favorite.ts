import type { Quote } from "./quote"

export type Favorite = {
    _id?: string 
  id?: string
  quote?: Quote
  quoteId?: string | Quote
  createdAt?: string
  updatedAt?: string
}

export type FavoriteActionResponse = {
  success?:boolean
  message?: string
  data?: Favorite | Quote| null
}