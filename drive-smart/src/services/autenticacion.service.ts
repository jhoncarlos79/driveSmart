import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
import {Cliente, Administrador, Asesor} from '../models';
import { Llaves } from '../config/llaves';
import { AsesorRepository } from '../repositories';
import { AdministradorRepository } from '../repositories';
import { ClienteRepository } from '../repositories';
import { repository } from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,
    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository
  ) {}


  // Generar una clave de 8 caracteres
  GenerarClave(){
    let clave = generador(8, false);
    return clave;
  }

  // Cifra una clave utilizando MD5
  CifrarClave(clave: string){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  // Autenticacion

  GenerarTokenCliente( cliente: Cliente ){
    let token = jwt.sign(
      {
        data: {
          id: cliente.id,
          correo: cliente.correo,
          nombre: cliente.nombre + " " + cliente.apellido,
          rol: "cliente"
        }
      }, Llaves.claveJWT
    );
    return token;
  }

  GenerarTokenAdministrador( cliente: Administrador ){
    let token = jwt.sign(
      {
        data: {
          id: cliente.id,
          correo: cliente.correo,
          nombre: cliente.nombre + " " + cliente.apellido,
          rol: "admin"
        }
      }, Llaves.claveJWT
    );
    return token;
  }

  GenerarTokenAsesor( cliente: Asesor ){
    let token = jwt.sign(
      {
        data: {
          id: cliente.id,
          correo: cliente.correo,
          nombre: cliente.nombre + " " + cliente.apellido,
          rol: "asesor"
        }
      }, Llaves.claveJWT
    );
    return token;
  }

  IdentificarAsesor( usuario:string,clave:string){
    try {
      let a = this.asesorRepository.findOne({where:{correo: usuario, contrasena: clave}});
      if(a){
        return a;
      }else{
        return false;
      }
    } catch {    
      return false;
    }
  }


  IdentificarAdministrador( usuario:string, clave:string){
    try {
      let ad = this.administradorRepository.findOne({where: {correo: usuario, contrasena: clave}});
      if(ad){
        return ad;
      }else{
        return false;
      }
    } catch {    
      return false;
    }
  }


  IdentificarCliente( usuario:string, clave:string ){
    try {
      let c = this.clienteRepository.findOne({where: {correo: usuario, contrasena: clave}});
      if( c ){
        return c;
      }else{
        return false;
      }
    } catch{
      return false;
    }
  }



  ValidarTokenJWT(token: string){
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }


  /*
   * Add service methods here
   */
}
