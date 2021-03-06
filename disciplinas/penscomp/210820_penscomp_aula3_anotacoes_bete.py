# -*- coding: utf-8 -*-
"""210820_penscomp_aula3_anotacoes_bete.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1svP_am0zQYI8v-sHNrEzyKPStugDsnjV
"""

nome_capitalize = input("Qual o seu nome? ").capitalize() # capitalize() transforma a primeira letra em maiúscula.
print(f"Olá, {nome_capitalize}! Como vai?")

nome_title = input("Qual o seu nome? ").title() # title() transforma a primeira letra em maiúscula.
print(f"Olá, {nome_title}! Como vai?")

nome_upper = input("Qual o seu nome? ").upper() # upper() transforma tudo em MAIÚSCULAS.
print(f"Olá, {nome_upper}! Como vai?")

nome_upper = input("Qual o seu nome? ").lower() # lower() transforma tudo em minúsculas.
print(f"Olá, {nome_upper}! Como vai?")

nome_strip = input("Qual o seu nome? ").strip().title() # strip() retira os espaços no início e no final da variável.
print(f"Olá, {nome_strip}! Como vai?")

help(str) #código para pedir ajuda de uma função

nome = input("Qual o seu nome? ")
if "bete" in nome.lower():  #verifica se é a "Bete"
  print(f"Oi, {nome.title()}. Eu também sou {nome.title()}! Como é que pode isso?")
else:
  print(f"Oi, {nome.title()}. Eu sou a Bete. Aqui é da Alameda Yayá.")

arquivo = open("GMT20210806-222707_Recording.txt")
for linha in arquivo:
  print(linha.strip().split("\t")) # Lista de strings, contendo: hora, nome

arquivo = open("GMT20210806-222707_Recording.txt")
for linha in arquivo:
  partes = linha.strip().split("\t")
  if len(partes) == 3:
    print(partes[1])

# criando uma lista manualmente:
notas = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
# Listas guardam elementos, mesmo que repetidos e na ordem que foram listados
# Listas são indexáveis: começam do 0 ao N - 1, sendo N = número de elementos.

for unidade in notas:
  print(f"Nota: {unidade}")

print(f"Nota: {notas[0]}") #primeiro elemento
print(f"Nota: {notas[1]}") #segundo
print(f"Nota: {len(notas)-1}") #último
print(f"Nota: {notas[-1]}") #também último

import csv
brasil = open("brasil.csv")
for linha in csv.DictReader(brasil):
  print(f"{linha['municipio']}/{linha['estado']} possui {linha['habitantes']} habitantes.")