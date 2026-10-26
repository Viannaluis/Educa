package br.edu.escola.modelo;

public record Usuario(int id, String nome, String email, String salt, String senhaHash, Perfil perfil) {
}
