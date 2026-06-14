import { CentralEngate } from "@/src/Icons/CentralEngate";
import { DesbloqueioTela } from "@/src/Icons/DesbloqueioTela";
import { DesligaRadio } from "@/src/Icons/DesligaRadio";
import { ModuloVidro } from "@/src/Icons/ModuloVidro";
import { Retrovisor } from "@/src/Icons/Retrovisor";
import { SubstituicaoOriginal } from "@/src/Icons/SubstituicaoOriginal";
import { TetoSolar } from "@/src/Icons/TetoSolar";
import { TravaEletrica } from "@/src/Icons/TravaEletrica";
import { TravaEletricaV2 } from "@/src/Icons/TravaEletricaV2";
import { Velocidade } from "@/src/Icons/Velocidade";
import { Volante } from "@/src/Icons/Volante";
import React from "react";
import { Image } from "react-native"; // <-- TEM QUE SER DE 'react-native'
const GiCarDoorPng = require("../Icons/GiCarDoor.png");
const Silock = require("../Icons/SiLock.png");

export const ICONS = [
  {
    label: "LEVANTAMENTO DE VIDRO",
    // Passando o resizeMode diretamente dentro do objeto style
    value: (
      <Image
        source={GiCarDoorPng}
        style={{ width: 40, height: 40, resizeMode: "contain" }}
      />
    ),
  },
  {
    label: "AUTODOWN",
    value: (
      <ModuloVidro className="w-[40px] text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "SUBSTITUIÇÃO ORIGINAL",
    value: (
      <SubstituicaoOriginal className="w-[50px] text-gray group-hover:text-white transition-all classSvg subOrigi" />
    ),
  },
  {
    label: "TRAVA ELÉTRICA",
    value: (
      <TravaEletrica className="w-full max-w-[55px] text-gray group-hover:text-white transition-all classSvg travaEle" />
    ),
  },
  {
    label: "CENTRAL DE ENGATE",
    value: (
      <CentralEngate className="w-[50px] mt-2.5 block text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "RETROVISOR",
    value: (
      <Retrovisor className="pr-[10px] text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "DESLIGA RÁDIO",
    value: (
      <DesligaRadio className="text-gray group-hover:text-white transition-all classSvg desligaRad" />
    ),
  },
  {
    label: "ALARME",
    value: (
      <TravaEletricaV2 className="!w-[65px] mt-3 text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "INTERFACE DE VOLANTE",
    value: (
      <Volante className="w-[45px] h-[50px] mt-3 text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "TRAVAMENTO POR VELOCIDADE",
    value: (
      <Velocidade className="w-[45px] mt-2 text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "SUBSTITUIÇÃO CENTRAL DE TRAVA ORIGINAL",
    value: (
      <Image
        source={Silock}
        style={{ width: 40, height: 40, resizeMode: "contain" }}
      />
    ),
  },
  {
    label: "TETO SOLAR",
    value: (
      <TetoSolar className="w-[75px] mb-[-15px] text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
  {
    label: "DESBLOQUEIO DE TELA",
    value: (
      <DesbloqueioTela className="w-[50px] mb-[-15px] text-gray group-hover:text-white transition-all classSvg" />
    ),
  },
];

export function CategoryIcons(value: string): React.ReactNode {
  const icon = ICONS.filter((icon) => icon.label === value);

  return icon[0]?.value;
}
