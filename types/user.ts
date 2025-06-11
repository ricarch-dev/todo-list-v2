export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  ubicacion?: string;
  telefono?: string;
  sitioWeb?: string;
  fechaRegistro?: string;
  verificado?: boolean;
}
