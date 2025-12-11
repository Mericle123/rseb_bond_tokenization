"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Wallet,
  ChevronDown,
  TrendingUp,
  PieChart,
  Coins,
} from "lucide-react";
import { useCurrentUser } from "@/context/UserContext";
import {
  fetchEarningDetail,
  type EarningDetail,
} from "@/server/db_actions/action";

/* ========================= Animation Variants ========================= */
const fadeIn = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  viewport: { once: true, margin: "-50px 0px -50px 0px" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const nf4 = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 2,
});

/* ========================= Loading Animation ========================= */
function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <style jsx>{`
        #svg_svg {
          zoom: 0.3;
        }
        .estrobo_animation {
          animation:
            floatAndBounce 4s infinite ease-in-out,
            strobe 0.8s infinite;
        }

        .estrobo_animationV2 {
          animation:
            floatAndBounce 4s infinite ease-in-out,
            strobev2 0.8s infinite;
        }

        #float_server {
          animation: floatAndBounce 4s infinite ease-in-out;
        }

        @keyframes floatAndBounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes strobe {
          0%,
          50%,
          100% {
            fill: #17e300;
          }

          25%,
          75% {
            fill: #17e300b4;
          }
        }

        @keyframes strobev2 {
          0%,
          50%,
          100% {
            fill: rgb(255, 95, 74);
          }

          25%,
          75% {
            fill: rgb(16, 53, 115);
          }
        }

        /* Animación de los colores del gradiente */
        @keyframes animateGradient {
          0% {
            stop-color: #313f8773;
          }

          50% {
            stop-color: #040d3a;
          }

          100% {
            stop-color: #313f8773;
          }
        }

        /* Animación aplicada a los puntos del gradiente */
        #paint13_linear_163_1030 stop {
          animation: animateGradient 4s infinite alternate;
        }
      `}</style>
      <svg
        id="svg_svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 477 578"
        height="578"
        width="477"
      >
        <g filter="url(#filter0_i_163_1030)">
          <path
            fill="#E9E9E9"
            d="M235.036 304.223C236.949 303.118 240.051 303.118 241.964 304.223L470.072 435.921C473.898 438.13 473.898 441.712 470.072 443.921L247.16 572.619C242.377 575.38 234.623 575.38 229.84 572.619L6.92817 443.921C3.10183 441.712 3.10184 438.13 6.92817 435.921L235.036 304.223Z"
          />
        </g>
        <path
          stroke="white"
          d="M235.469 304.473C237.143 303.506 239.857 303.506 241.531 304.473L469.639 436.171C473.226 438.242 473.226 441.6 469.639 443.671L246.727 572.369C242.183 574.992 234.817 574.992 230.273 572.369L7.36118 443.671C3.77399 441.6 3.774 438.242 7.36119 436.171L235.469 304.473Z"
        />
        <path
          stroke="white"
          fill="#C3CADC"
          d="M234.722 321.071C236.396 320.105 239.111 320.105 240.785 321.071L439.477 435.786C443.064 437.857 443.064 441.215 439.477 443.286L240.785 558.001C239.111 558.967 236.396 558.967 234.722 558.001L36.0304 443.286C32.4432 441.215 32.4432 437.857 36.0304 435.786L234.722 321.071Z"
        />
        <path
          fill="#4054B2"
          d="M234.521 366.089C236.434 364.985 239.536 364.985 241.449 366.089L406.439 461.346L241.247 556.72C239.333 557.825 236.231 557.825 234.318 556.72L69.3281 461.463L234.521 366.089Z"
        />
        <path
          fill="#30439B"
          d="M237.985 364.089L237.984 556.972C236.144 556.941 235.082 556.717 233.13 556.043L69.3283 461.463L237.985 364.089Z"
        />
        <path
          fill="url(#paint0_linear_163_1030)"
          d="M36.2146 117.174L237.658 0.435217V368.615C236.541 368.598 235.686 368.977 233.885 370.124L73.1836 463.678L39.2096 444.075C37.0838 442.229 36.285 440.981 36.2146 438.027V117.174Z"
          id="layer_pared"
        />
        <path
          fill="url(#paint1_linear_163_1030)"
          d="M439.1 116.303L237.657 0.435568V368.616C238.971 368.585 239.822 369.013 241.43 370.135L403.64 462.925L436.128 444.089C437.832 442.715 438.975 441.147 439.1 439.536V116.303Z"
          id="layer_pared"
        />
        <path
          fill="#27C6FD"
          d="M64.5447 181.554H67.5626V186.835L64.5447 188.344V181.554Z"
          id="float_server"
        />
        <path
          fill="#138EB9"
          d="M88.3522 374.347L232.415 457.522C234.202 458.405 234.866 458.629 236.335 458.71V468.291C235.356 468.291 234.086 468.212 232.415 467.275L88.3522 384.1C86.3339 382.882 85.496 382.098 85.4707 380.198V370.428L88.3522 374.347Z"
          id="float_server"
        />
        <path
          fill="#138EB9"
          d="M384.318 374.445L240.254 457.62C238.914 458.385 238.295 458.629 236.335 458.71V468.291C237.315 468.291 238.704 468.211 240.236 467.274L384.318 384.198C386.457 383.091 387.151 382.244 387.258 380.228V370.917C386.768 372.387 386.21 373.295 384.318 374.445Z"
          id="float_server"
        />
        <path
          stroke="url(#paint3_linear_163_1030)"
          fill="url(#paint2_linear_163_1030)"
          d="M240.452 226.082L408.617 323.172C412.703 325.531 412.703 329.355 408.617 331.713L240.452 428.803C238.545 429.904 235.455 429.904 233.548 428.803L65.3832 331.713C61.298 329.355 61.298 325.531 65.3832 323.172L233.548 226.082C235.455 224.982 238.545 224.982 240.452 226.082Z"
          id="float_server"
        />
        <path
          fill="#5B6CA2"
          d="M408.896 332.123L241.489 428.775C240.013 429.68 238.557 430.033 236.934 430.033V464.518C238.904 464.518 239.366 464.169 241.489 463.233L408.896 366.58C411.372 365.292 412.125 363.262 412.312 361.317C412.312 361.317 412.312 326.583 412.312 327.722C412.312 328.86 411.42 330.514 408.896 332.123Z"
          id="float_server"
        />
        <path
          fill="#6879AF"
          d="M240.92 429.077L255.155 420.857V432.434L251.511 439.064V457.432L241.489 463.242C240.116 463.858 239.141 464.518 236.934 464.518V430.024C238.695 430.024 239.862 429.701 240.92 429.077Z"
          id="float_server"
        />
        <path
          fill="url(#paint4_linear_163_1030)"
          d="M65.084 331.984L232.379 428.571C233.882 429.619 235.101 430.005 236.934 430.005V464.523C234.656 464.523 234.285 464.215 232.379 463.214L65.084 366.442C62.4898 365 61.6417 362.992 61.6699 361.29V327.125C61.6899 329.24 62.4474 330.307 65.084 331.984Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M400.199 361.032C403.195 359.302 405.623 355.096 405.623 351.637C405.623 348.177 403.195 346.775 400.199 348.505C397.203 350.235 394.775 354.441 394.775 357.9C394.775 361.359 397.203 362.762 400.199 361.032Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M221.404 446.444C224.4 448.174 226.828 446.771 226.828 443.312C226.828 439.853 224.4 435.646 221.404 433.917C218.408 432.187 215.979 433.589 215.979 437.049C215.979 440.508 218.408 444.714 221.404 446.444Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M102.895 359.589L97.9976 356.762V380.07L102.895 382.897V359.589Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M102.895 359.619L98.3394 356.989V379.854L102.895 382.484V359.619Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M78.9793 345.923L74.0823 343.096V366.37L78.9793 369.198V345.923Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M86.9512 350.478L82.0542 347.651V370.959L86.9512 373.787V350.478Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M94.9229 355.034L90.0259 352.206V375.515L94.9229 378.342V355.034Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M86.951 350.509L82.3958 347.879V370.743L86.951 373.373V350.509Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M94.9227 355.064L90.3674 352.434V375.299L94.9227 377.929V355.064Z"
          className="estrobo_animation"
        />
        <path
          fill="#313654"
          d="M78.9794 345.954L74.4241 343.324V366.188L78.9794 368.818V345.954Z"
          className="estrobo_animation"
        />
        <path
          fill="#333B5F"
          d="M221.859 446.444C224.855 448.174 227.284 446.771 227.284 443.312C227.284 439.853 224.855 435.646 221.859 433.917C218.863 432.187 216.435 433.589 216.435 437.049C216.435 440.508 218.863 444.714 221.859 446.444Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M399.516 361.032C402.511 359.302 404.94 355.096 404.94 351.637C404.94 348.177 402.511 346.775 399.516 348.505C396.52 350.235 394.091 354.441 394.091 357.9C394.091 361.359 396.52 362.762 399.516 361.032Z"
          id="float_server"
        />
        <path
          fill="#27C6FD"
          d="M88.3522 317.406L232.415 400.581C234.202 401.464 234.866 401.688 236.335 401.769V411.35C235.356 411.35 234.086 411.271 232.415 410.334L88.3522 327.159C86.3339 325.941 85.496 325.157 85.4707 323.256V313.486L88.3522 317.406Z"
          id="float_server"
        />
        <path
          fill="#27C6FD"
          d="M384.318 317.504L240.254 400.679C238.914 401.444 238.295 401.688 236.335 401.769V411.35C237.315 411.35 238.704 411.27 240.236 410.333L384.318 327.257C386.457 326.15 387.151 325.303 387.258 323.287V313.976C386.768 315.446 386.21 316.354 384.318 317.504Z"
          id="float_server"
        />
        <path
          stroke="url(#paint6_linear_163_1030)"
          fill="url(#paint5_linear_163_1030)"
          d="M240.452 169.141L408.617 266.231C412.703 268.59 412.703 272.414 408.617 274.772L240.452 371.862C238.545 372.962 235.455 372.962 233.548 371.862L65.3832 274.772C61.298 272.414 61.298 268.59 65.3832 266.231L233.548 169.141C235.455 168.04 238.545 168.04 240.452 169.141Z"
          id="float_server"
        />
        <path
          fill="#5B6CA2"
          d="M408.896 275.182L241.489 371.834C240.013 372.739 238.557 373.092 236.934 373.092V407.577C238.904 407.577 239.366 407.229 241.489 406.292L408.896 309.64C411.372 308.352 412.125 306.321 412.312 304.376C412.312 304.376 412.312 269.642 412.312 270.781C412.312 271.92 411.42 273.573 408.896 275.182Z"
          id="float_server"
        />
        <path
          fill="#6879AF"
          d="M240.92 372.135L255.155 363.915V375.493L251.511 382.123V400.491L241.489 406.3C240.116 406.916 239.141 407.577 236.934 407.577V373.083C238.695 373.083 239.862 372.759 240.92 372.135Z"
          id="float_server"
        />
        <path
          fill="url(#paint7_linear_163_1030)"
          d="M65.084 275.043L232.379 371.63C233.882 372.678 235.101 373.064 236.934 373.064V407.582C234.656 407.582 234.285 407.274 232.379 406.273L65.084 309.501C62.4898 308.059 61.6417 306.051 61.6699 304.349V270.184C61.6899 272.299 62.4474 273.366 65.084 275.043Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M400.199 304.091C403.195 302.362 405.623 298.155 405.623 294.696C405.623 291.237 403.195 289.835 400.199 291.564C397.203 293.294 394.775 297.5 394.775 300.959C394.775 304.419 397.203 305.821 400.199 304.091Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M221.404 389.503C224.4 391.232 226.828 389.83 226.828 386.371C226.828 382.912 224.4 378.705 221.404 376.976C218.408 375.246 215.979 376.648 215.979 380.107C215.979 383.567 218.408 387.773 221.404 389.503Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M102.553 301.281L97.656 298.454V321.762L102.553 324.59V301.281Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M102.553 301.312L97.9976 298.682V321.546L102.553 324.176V301.312Z"
          className="estrobo_animation"
        />
        <path
          fill="#494F76"
          d="M78.6377 287.615L73.7407 284.788V308.063L78.6377 310.89V287.615Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M86.6094 292.171L81.7124 289.343V312.652L86.6094 315.479V292.171Z"
          id="float_server"
        />
        <path
          fill="#494F76"
          d="M94.5811 296.726L89.6841 293.899V317.207L94.5811 320.034V296.726Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M86.6095 292.201L82.0542 289.571V312.436L86.6095 315.066V292.201Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M94.5812 296.756L90.0259 294.126V316.991L94.5812 319.621V296.756Z"
          className="estrobo_animationV2"
        />
        <path
          fill="#313654"
          d="M78.6376 287.646L74.0823 285.016V307.88L78.6376 310.51V287.646Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M221.859 389.503C224.855 391.232 227.284 389.83 227.284 386.371C227.284 382.912 224.855 378.705 221.859 376.976C218.863 375.246 216.435 376.648 216.435 380.107C216.435 383.567 218.863 387.773 221.859 389.503Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M399.516 304.091C402.511 302.362 404.94 298.155 404.94 294.696C404.94 291.237 402.511 289.835 399.516 291.564C396.52 293.294 394.091 297.5 394.091 300.959C394.091 304.419 396.52 305.821 399.516 304.091Z"
          id="float_server"
        />
        <path
          fill="#27C6FD"
          d="M89.4907 214.912L233.554 298.087C235.341 298.97 236.003 299.194 237.474 299.275V308.856C236.494 308.856 235.223 308.777 233.554 307.84L89.4907 224.665C87.4726 223.447 86.6347 222.663 86.6094 220.762V210.993L89.4907 214.912Z"
          id="float_server"
        />
        <path
          fill="#27C6FD"
          d="M385.457 215.01L241.393 298.185C240.053 298.951 239.434 299.194 237.474 299.275V308.856C238.454 308.856 239.844 308.776 241.375 307.839L385.457 224.763C387.597 223.656 388.29 222.809 388.397 220.793V211.482C387.907 212.953 387.349 213.86 385.457 215.01Z"
          id="float_server"
        />
        <path
          fill="url(#paint8_linear_163_1030)"
          d="M66.1102 196.477L233.517 293.129C235.593 294.154 236.364 294.416 238.073 294.509V305.642C236.934 305.642 235.458 305.551 233.517 304.463L66.1102 207.81C63.7651 206.394 62.7914 205.483 62.762 203.275V191.922L66.1102 196.477Z"
          id="float_server"
        />
        <path
          fill="#5B6CA2"
          d="M410.101 196.591L242.694 293.243C241.135 294.132 240.35 294.375 238.073 294.468V305.643C239.211 305.643 240.892 305.55 242.671 304.46L410.101 207.923C412.587 206.638 413.392 205.653 413.517 203.31V192.491C412.948 194.199 412.3 195.254 410.101 196.591Z"
          id="float_server"
        />
        <path
          stroke="url(#paint10_linear_163_1030)"
          fill="url(#paint9_linear_163_1030)"
          d="M241.59 90.5623L409.756 187.652C413.842 190.011 413.842 193.835 409.756 196.194L241.59 293.284C239.684 294.384 236.593 294.384 234.687 293.284L66.5219 196.194C62.4367 193.835 62.4367 190.011 66.5219 187.652L234.687 90.5623C236.593 89.4616 239.684 89.4616 241.59 90.5623Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M89.0427 195.334C92.0385 197.063 96.8956 197.063 99.8914 195.334C102.887 193.604 102.887 190.8 99.8914 189.07C96.8956 187.341 92.0385 187.341 89.0427 189.07C86.0469 190.8 86.0469 193.604 89.0427 195.334Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M231.396 111.061C234.391 112.791 239.249 112.791 242.244 111.061C245.24 109.331 245.24 106.527 242.244 104.798C239.249 103.068 234.391 103.068 231.396 104.798C228.4 106.527 228.4 109.331 231.396 111.061Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M374.887 194.195C377.883 195.925 382.74 195.925 385.736 194.195C388.732 192.465 388.732 189.661 385.736 187.932C382.74 186.202 377.883 186.202 374.887 187.932C371.891 189.661 371.891 192.465 374.887 194.195Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M231.396 279.607C234.391 281.336 239.249 281.336 242.244 279.607C245.24 277.877 245.24 275.073 242.244 273.343C239.249 271.613 234.391 271.613 231.396 273.343C228.4 275.073 228.4 277.877 231.396 279.607Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M232.109 279.607C235.104 281.336 239.962 281.336 242.957 279.607C245.953 277.877 245.953 275.073 242.957 273.343C239.962 271.613 235.104 271.613 232.109 273.343C229.113 275.073 229.113 277.877 232.109 279.607Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M89.7563 195.334C92.7521 197.063 97.6092 197.063 100.605 195.334C103.601 193.604 103.601 190.8 100.605 189.07C97.6092 187.341 92.7521 187.341 89.7563 189.07C86.7605 190.8 86.7605 193.604 89.7563 195.334Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M232.109 111.061C235.104 112.791 239.962 112.791 242.957 111.061C245.953 109.331 245.953 106.527 242.957 104.798C239.962 103.068 235.104 103.068 232.109 104.798C229.113 106.527 229.113 109.331 232.109 111.061Z"
          id="float_server"
        />
        <path
          fill="#333B5F"
          d="M375.6 194.195C378.595 195.925 383.453 195.925 386.448 194.195C389.444 192.465 389.444 189.661 386.448 187.932C383.453 186.202 378.595 186.202 375.6 187.932C372.604 189.661 372.604 192.465 375.6 194.195Z"
          id="float_server"
        />
        <path
          stroke="#313654"
          d="M371.315 166.009L354.094 176.748C351.92 178.337 350.677 179.595 350.677 181.872L351.247 196.108C351.412 198.824 350.734 200.095 347.83 201.802L251.03 257.603C248.955 258.968 247.598 259.356 244.767 259.312L215.727 258.743C212.711 258.605 211.233 259.005 208.894 260.45L193.659 269.072"
          id="float_server"
        />
        <path
          stroke="#313654"
          d="M345.691 151.204L328.328 161.374C326.154 162.963 324.911 164.221 324.911 166.498L325.481 180.734C325.646 183.45 324.968 184.721 322.064 186.428L225.264 242.229C223.19 243.594 221.832 243.982 219.001 243.938L189.961 243.369C186.946 243.231 185.468 243.631 183.128 245.076L167.124 253.698"
          id="float_server"
        />
        <path
          stroke="#313654"
          d="M105.482 218.098L122.697 207.363C124.87 205.773 126.111 204.516 126.111 202.24L125.537 188.007C125.371 185.291 126.048 184.02 128.951 182.314L225.715 126.533C227.788 125.17 229.146 124.782 231.976 124.825L261.012 125.398C264.026 125.535 265.503 125.136 267.842 123.691L283.072 115.072"
          id="float_server"
        />
        <path
          stroke="#313654"
          d="M131.121 232.893L148.482 222.725C150.656 221.136 151.898 219.879 151.898 217.601L151.327 203.367C151.162 200.65 151.839 199.379 154.743 197.673L251.531 141.878C253.605 140.514 254.962 140.126 257.794 140.17L286.832 140.74C289.847 140.878 291.325 140.478 293.664 139.032L309.667 130.412"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M327.961 242.79L301.907 227.748L300.673 228.46L326.727 243.503L327.961 242.79Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M354.625 227.426L328.56 212.377L327.326 213.09L353.392 228.139L354.625 227.426Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M300.864 258.519L274.707 243.417L273.474 244.129L299.631 259.231L300.864 258.519Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M176.498 155.101L150.21 139.924L148.977 140.636L175.264 155.813L176.498 155.101Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M193.703 145.191L167.388 129.998L166.154 130.711L192.469 145.903L193.703 145.191Z"
          id="float_server"
        />
        <path
          fill="#313654"
          d="M158.333 165.69L131.974 150.472L130.74 151.184L157.099 166.402L158.333 165.69Z"
          id="float_server"
        />
        <path
          fill="#20273A"
          d="M232.079 135.83C234.258 134.573 237.79 134.573 239.969 135.83L329.717 187.647C334.074 190.163 334.074 194.242 329.717 196.757L239.969 248.574C237.79 249.832 234.258 249.832 232.079 248.574L142.33 196.757C137.972 194.242 137.972 190.163 142.33 187.647L232.079 135.83Z"
          id="float_server"
        />
        <path
          fill="url(#paint11_linear_163_1030)"
          d="M234.357 135.83C236.535 134.573 240.068 134.573 242.246 135.83L331.995 187.647C336.352 190.163 336.352 194.242 331.995 196.757L242.246 248.574C240.068 249.832 236.535 249.832 234.357 248.574L144.608 196.757C140.25 194.242 140.25 190.163 144.608 187.647L234.357 135.83Z"
          id="float_server"
        />
        <path
          strokeWidth="3"
          stroke="#27C6FD"
          d="M380.667 192.117V181.97C380.667 179.719 383.055 178.27 385.052 179.309L409.985 192.282C410.978 192.799 411.601 193.825 411.601 194.943V301.113C411.601 302.642 409.953 303.606 408.62 302.856L399.529 297.742"
          className="after_animation"
          id="float_server"
        />
        <path
          strokeWidth="3"
          stroke="#27C6FD"
          d="M94.7234 192.117V180.306C94.7234 179.214 94.1301 178.208 93.1744 177.68L70.5046 165.152C68.5052 164.047 66.0536 165.493 66.0536 167.778V185.326"
          id="float_server"
        />
        <ellipse
          fill="#27C6FD"
          ry="1.50894"
          rx="1.50894"
          cy="192.117"
          cx="380.667"
          id="float_server"
        />
        <ellipse
          fill="#27C6FD"
          ry="1.50894"
          rx="1.50894"
          cy="192.117"
          cx="94.7235"
          id="float_server"
        />
        <ellipse
          fill="#27C6FD"
          ry="1.50894"
          rx="1.50894"
          cy="297.742"
          cx="399.529"
          id="float_server"
        />
        <ellipse
          fill="#27C6FD"
          ry="1.50894"
          rx="1.50894"
          cy="383.751"
          cx="221.474"
          id="float_server"
        />
        <ellipse
          fill="#27C6FD"
          ry="1.50894"
          rx="1.50894"
          cy="439.583"
          cx="221.474"
          id="float_server"
        />
        <path
          strokeWidth="3"
          stroke="#27C6FD"
          d="M221.474 383.752L211.746 388.941C210.768 389.462 210.157 390.48 210.157 391.588V444.34C210.157 445.108 210.988 445.589 211.654 445.208L221.474 439.583"
          id="float_server"
        />
        <path
          fill="url(#paint13_linear_163_1030)"
          d="M237.376 236.074L36 119.684V439.512C36.0957 441.966 36.7214 443.179 39.0056 445.021L200.082 538.547L231.362 556.441C233.801 557.806 235.868 558.222 237.376 558.328V236.074Z"
          id="layer_pared"
        />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="556.454"
            x2="438.984"
            y1="235.918"
            x1="237.376"
            id="paint13_linear_163_1030"
          >
            <stop stopColor="#4457b3" stopOpacity={0} offset="10%" />
            <stop stopColor="#4457b3" stopOpacity={1} offset="100%" />
          </linearGradient>
        </defs>
        <path
          fill="url(#paint13_linear_163_1030)"
          d="M237.376 235.918L438.984 119.576V439.398C439.118 441.699 438.452 442.938 435.975 444.906L274.712 538.539L243.397 556.454C240.955 557.821 238.886 558.23 237.376 558.336V235.918Z"
          className="animatedStop"
          id="layer_pared"
        />
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="275.295"
            width="468.883"
            y="303.394"
            x="4.05835"
            id="filter0_i_163_1030"
          >
            <feFlood result="BackgroundImageFix" floodOpacity={0} />
            <feBlend
              result="shape"
              in2="BackgroundImageFix"
              in="SourceGraphic"
              mode="normal"
            />
            <feColorMatrix
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              type="matrix"
              in="SourceAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite
              k3="1"
              k2="-1"
              operator="arithmetic"
              in2="hardAlpha"
            />
            <feColorMatrix
              values="0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 1 0"
              type="matrix"
            />
            <feBlend
              result="effect1_innerShadow_163_1030"
              in2="shape"
              mode="normal"
            />
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="336.055"
            x2="294.366"
            y1="60.1113"
            x1="135.05"
            id="paint0_linear_163_1030"
          >
            <stop stopOpacity="0.01" stopColor="white" offset="0.305" />
            <stop stopColor="#4054B2" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="335.208"
            x2="180.935"
            y1="59.2405"
            x1="340.265"
            id="paint1_linear_163_1030"
          >
            <stop stopOpacity="0.01" stopColor="white" offset="0.305" />
            <stop stopColor="#4054B2" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="420.619"
            x2="88.5367"
            y1="327.152"
            x1="412.313"
            id="paint2_linear_163_1030"
          >
            <stop stopColor="#313654" />
            <stop stopColor="#313654" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="211.092"
            x2="168.239"
            y1="426.799"
            x1="236.934"
            id="paint3_linear_163_1030"
          >
            <stop stopColor="#7281B8" />
            <stop stopColor="#333952" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="349.241"
            x2="232.379"
            y1="349.241"
            x1="65.0839"
            id="paint4_linear_163_1030"
          >
            <stop stopColor="#7281B8" />
            <stop stopColor="#5D6EA4" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="363.678"
            x2="88.5367"
            y1="270.211"
            x1="412.313"
            id="paint5_linear_163_1030"
          >
            <stop stopColor="#313654" />
            <stop stopColor="#313654" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="154.15"
            x2="168.239"
            y1="369.858"
            x1="236.934"
            id="paint6_linear_163_1030"
          >
            <stop stopColor="#7281B8" />
            <stop stopColor="#333952" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="292.3"
            x2="232.379"
            y1="292.3"
            x1="65.0839"
            id="paint7_linear_163_1030"
          >
            <stop stopColor="#7281B8" />
            <stop stopColor="#5D6EA4" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="198.899"
            x2="238.073"
            y1="198.899"
            x1="62.762"
            id="paint8_linear_163_1030"
          >
            <stop stopColor="#7382B9" />
            <stop stopColor="#5D6EA4" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="191.599"
            x2="67.1602"
            y1="191.633"
            x1="413.451"
            id="paint9_linear_163_1030"
          >
            <stop stopColor="#5F6E99" />
            <stop stopColor="#465282" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="191.599"
            x2="63.6601"
            y1="191.599"
            x1="417.16"
            id="paint10_linear_163_1030"
          >
            <stop stopColor="#7281B8" />
            <stop stopColor="#333952" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="243.221"
            x2="156.734"
            y1="191.633"
            x1="335.442"
            id="paint11_linear_163_1030"
          >
            <stop stopColor="#313654" />
            <stop stopColor="#313654" offset="1" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="421.983"
            x2="-1.9283"
            y1="179.292"
            x1="138.189"
            id="paint12_linear_163_1030"
          >
            <stop stopOpacity="0.01" stopColor="white" offset="0.305" />
            <stop stopColor="#4054B2" offset="1" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-slate-500 text-sm mt-4">Loading interest details...</p>
    </div>
  );
}

/* ========================= Wallet Strip ========================= */

function WalletStrip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <motion.div
      {...fadeIn}
      className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/70 shadow-sm shadow-slate-200/50 overflow-hidden backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B50D9] to-[#7B73E6] shadow-md"
          >
            <Wallet className="w-5 h-5 text-white" strokeWidth={2} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 mb-1">
              Wallet Address
            </p>
            <code className="block text-xs sm:text-sm font-mono text-slate-900 bg-white/50 px-3 py-2 rounded-lg border border-slate-200 truncate">
              {address}
            </code>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copy}
          className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 hover:border-[#5B50D9]/30 hover:shadow-md hover:shadow-[#5B50D9]/10 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: copied ? 360 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Copy className="w-4 h-4 text-slate-600 group-hover:text-[#5B50D9]" />
          </motion.div>
          <span className="text-slate-700 group-hover:text-[#5B50D9]">
            {copied ? "Copied!" : "Copy Address"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ========================= Tabs & MenuSelect ========================= */

function Tabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {options.map((o) => {
        const active = value === o;
        return (
          <motion.button
            key={o}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(o)}
            type="button"
            className={`relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
              active
                ? "text-white"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#5B50D9] to-[#7B73E6] rounded-xl shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{o}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

type MenuSelectProps = {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  menuMaxHeight?: number;
  align?: "left" | "right";
  ariaLabel?: string;
};

function MenuSelect({
  value,
  options,
  onChange,
  icon,
  menuMaxHeight = 300,
  align = "left",
  ariaLabel,
}: MenuSelectProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o === value))
  );

  useEffect(() => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o === value)));
  }, [value, options]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const next = options[activeIndex] ?? value;
      onChange(next);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!open) return;
    const el = menuRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div className="relative z-40">
      <motion.button
        ref={btnRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKey}
        className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium bg-white transition-all duration-300 ${
          open
            ? "border-[#5B50D9] bg-[#5B50D9]/5 shadow-lg shadow-[#5B50D9]/10"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
      >
        {icon && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <span className="min-w-[6ch] text-slate-700">{value}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute mt-2 w-[220px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl shadow-slate-300/30 ${
              align === "right" ? "right-0" : "left-0"
            }`}
            style={{ maxHeight: menuMaxHeight, overflowY: "auto" }}
            onKeyDown={onKey}
          >
            {options.map((opt, idx) => {
              const active = idx === activeIndex;
              const selected = value === opt;
              return (
                <div key={opt}>
                  <motion.button
                    type="button"
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      btnRef.current?.focus();
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(91, 80, 217, 0.08)",
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                      active ? "bg-[#5B50D9]/10" : "bg-transparent"
                    } ${
                      selected ? "text-[#5B50D9]" : "text-slate-700"
                    }`}
                  >
                    {opt}
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-[#5B50D9]"
                      />
                    )}
                  </motion.button>
                  {idx < options.length - 1 && (
                    <div className="mx-4 border-t border-slate-100" />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================= Chart helpers ========================= */

type DailyPoint = {
  date: Date;
  interestForDay: number;
  cumulativeInterest: number;
};

function buildDailyPoints(detail: EarningDetail): DailyPoint[] {
  const start = new Date(detail.purchaseDateISO);
  const now = new Date();
  const msPerDay = 86_400_000;

  const days = Math.max(
    1,
    Math.floor((now.getTime() - start.getTime()) / msPerDay)
  );

  const dailyInterest =
    (detail.totalInvestment * (detail.ratePct / 100)) / 365;

  const points: DailyPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * msPerDay);
    const cumulativeInterest = dailyInterest * (i + 1);
    points.push({ date, interestForDay: dailyInterest, cumulativeInterest });
  }
  return points;
}

function useContainerWidth<T extends HTMLElement>(min = 280) {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState<number>(min);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      setW(Math.max(min, entries[0].contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [min]);
  return { ref, width: w };
}

function LineChart({
  data,
  yLabel = "BTN Coin",
  xLabels,
}: {
  data: number[];
  yLabel?: string;
  xLabels: string[];
}) {
  const { ref, width } = useContainerWidth<HTMLDivElement>(280);
  const height = 300;
  const pad = { t: 25, r: 25, b: 45, l: 60 };

  if (!data.length) {
    return (
      <div ref={ref} className="w-full text-sm text-slate-500">
        No data yet
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const n = data.length;
  const step = (width - pad.l - pad.r) / Math.max(1, n - 1);

  const pts = data.map((v, i) => {
    const x = pad.l + i * step;
    const y = pad.t + (1 - (v - min) / range) * (height - pad.t - pad.b);
    return [x, y] as const;
  });

  const pathD = pts
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");

  const areaD =
    pathD +
    ` L ${pts[pts.length - 1][0]} ${height - pad.b} L ${pts[0][0]} ${
      height - pad.b
    } Z`;

  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B50D9" />
            <stop offset="100%" stopColor="#7B73E6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B50D9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5B50D9" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((g) => {
          const y = pad.t + (g / 4) * (height - pad.t - pad.b);
          return (
            <line
              key={g}
              x1={pad.l}
              x2={width - pad.r}
              y1={y}
              y2={y}
              stroke="#F1F5F9"
              strokeWidth={1}
            />
          );
        })}

        <text
          x={20}
          y={pad.t + (height - pad.t - pad.b) / 2}
          fill="#64748B"
          fontSize="12"
          fontWeight="500"
          transform={`rotate(-90 20 ${
            pad.t + (height - pad.t - pad.b) / 2
          })`}
          textAnchor="middle"
        >
          {yLabel}
        </text>

        {xLabels.map((lbl, i) => {
          const x =
            pad.l +
            i *
              ((width - pad.l - pad.r) / (xLabels.length - 1 || 1));
          return (
            <text
              key={i}
              x={x}
              y={height - 15}
              textAnchor="middle"
              fontSize="11"
              fill="#64748B"
              fontWeight="500"
            >
              {lbl}
            </text>
          );
        })}

        <motion.path
          d={areaD}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="white"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: i * 0.05,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ r: 6, strokeWidth: 3 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ========================= Stats Card ========================= */

function StatsCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <motion.div
      {...scaleIn}
      className="rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-slate-100/80">
          <Icon className="w-5 h-5 text-[#5B50D9]" />
        </div>
        {change && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </motion.div>
  );
}

/* ========================= MAIN PAGE ========================= */

export default function InterestAccumulationPage({
  params,
}: {
  params: Promise<{ allocationId: string }>;
}) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const walletAddress = currentUser?.wallet_address ?? "";
  
  // Properly unwrap the params promise using React.use()
  const unwrappedParams = React.use(params);
  const { allocationId } = unwrappedParams;

  const [detail, setDetail] = useState<EarningDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [chartGran, setChartGran] =
    useState<"Month" | "Week" | "Day">("Month");
  const [tableGran, setTableGran] =
    useState<"Month" | "Week" | "Day">("Day");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const d = await fetchEarningDetail(allocationId);
        setDetail(d);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [allocationId]);

  const dailyPoints = useMemo(
    () => (detail ? buildDailyPoints(detail) : []),
    [detail]
  );

  // ----------------- derive chart data -----------------
  const { chartValues, xLabels } = useMemo(() => {
    if (!dailyPoints.length) return { chartValues: [], xLabels: [] };

    if (chartGran === "Day") {
      return {
        chartValues: dailyPoints.map((p) => p.cumulativeInterest),
        xLabels: dailyPoints.map((p, i) =>
          i % 3 === 0 ? p.date.getDate().toString() : ""
        ),
      };
    }

    if (chartGran === "Week") {
      const weeks: { label: string; value: number }[] = [];
      for (let i = 0; i < dailyPoints.length; i += 7) {
        const slice = dailyPoints.slice(i, i + 7);
        const last = slice[slice.length - 1];
        const weekIndex = weeks.length + 1;
        weeks.push({
          label: `W${weekIndex}`,
          value: last.cumulativeInterest,
        });
      }
      return {
        chartValues: weeks.map((w) => w.value),
        xLabels: weeks.map((w) => w.label),
      };
    }

    // Month
    const byMonth = new Map<string, { label: string; value: number }>();
    dailyPoints.forEach((p) => {
      const y = p.date.getFullYear();
      const m = p.date.getMonth();
      const key = `${y}-${m}`;
      const label = p.date.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });
      byMonth.set(key, { label, value: p.cumulativeInterest });
    });
    const vals = Array.from(byMonth.values());
    return {
      chartValues: vals.map((v) => v.value),
      xLabels: vals.map((v) => v.label),
    };
  }, [dailyPoints, chartGran]);

  // ----------------- table data -----------------
  const { tableTitle, tableRows } = useMemo(() => {
    if (!dailyPoints.length)
      return { tableTitle: "No data", tableRows: [] as any[] };

    if (tableGran === "Day") {
      const rows = dailyPoints.map((p) => ({
        dateStr: p.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        interestEarned: p.interestForDay,
        cumulative: p.cumulativeInterest,
      }));
      return { tableTitle: "Daily Accumulation", tableRows: rows };
    }

    if (tableGran === "Week") {
      const rows: {
        dateStr: string;
        interestEarned: number;
        cumulative: number;
      }[] = [];
      for (let i = 0; i < dailyPoints.length; i += 7) {
        const slice = dailyPoints.slice(i, i + 7);
        const last = slice[slice.length - 1];
        const weekIndex = rows.length + 1;
        rows.push({
          dateStr: `Week ${weekIndex}`,
          interestEarned:
            slice[0].interestForDay * slice.length,
          cumulative: last.cumulativeInterest,
        });
      }
      return { tableTitle: "Weekly Accumulation", tableRows: rows };
    }

    // Month
    const groups = new Map<
      string,
      { dateStr: string; interest: number; cumulative: number }
    >();

    dailyPoints.forEach((p) => {
      const y = p.date.getFullYear();
      const m = p.date.getMonth();
      const key = `${y}-${m}`;
      const label = p.date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, {
          dateStr: label,
          interest: p.interestForDay,
          cumulative: p.cumulativeInterest,
        });
      } else {
        existing.interest += p.interestForDay;
        existing.cumulative = p.cumulativeInterest;
      }
    });

    const rows = Array.from(groups.values());
    return { tableTitle: "Monthly Accumulation", tableRows: rows };
  }, [dailyPoints, tableGran]);

  if (loading || !detail) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <InvestorSideNavbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingAnimation />
        </main>
      </div>
    );
  }

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth =
    monthsList[new Date(detail.purchaseDateISO).getMonth()];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <InvestorSideNavbar currentUser={currentUser} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Interest Accumulation
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                {detail.bondName} ({detail.bondSymbol}) •{" "}
                {detail.bondType}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Purchased on {detail.purchaseDateLabel} • Matures on{" "}
                {detail.maturityLabel}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="group inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 w-fit"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
              <span className="text-slate-700 group-hover:text-slate-900">
                Back to Earnings
              </span>
            </motion.button>
          </div>

          <WalletStrip address={walletAddress} />
        </motion.header>

        {/* Stats grid */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard
            icon={TrendingUp}
            label="Total Interest Earned"
            value={`BTNC ${nf4.format(detail.interestAccrued)}`}
          />
          <StatsCard
            icon={PieChart}
            label="Current APY"
            value={`${detail.ratePct.toFixed(2)}%`}
          />
          <StatsCard
            icon={Coins}
            label="Principal (Total Investment)"
            value={`BTNC ${nf4.format(detail.totalInvestment)}`}
          />
          <StatsCard
            icon={Wallet}
            label="Units Allocated"
            value={nf4.format(detail.unitsAllocated)}
          />
        </motion.section>

        {/* Main card */}
        <motion.section
          {...fadeIn}
          className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm shadow-slate-200/50 overflow-hidden"
        >
          {/* Card header */}
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#5B50D9] to-[#7B73E6] shadow-md"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {detail.bondName} Performance
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Simple interest accrual from allocation date to today
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MenuSelect
                  icon={<Calendar className="w-4 h-4 text-slate-600" />}
                  value={currentMonth}
                  onChange={() => {}}
                  options={monthsList}
                  menuMaxHeight={360}
                  ariaLabel="Month (informational)"
                  align="right"
                />
                <MenuSelect
                  value={chartGran}
                  onChange={(v) => setChartGran(v as typeof chartGran)}
                  options={["Month", "Week", "Day"]}
                  ariaLabel="Select chart granularity"
                  align="right"
                  menuMaxHeight={200}
                />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <LineChart
              data={chartValues}
              xLabels={xLabels}
              yLabel="Interest (BTNC)"
            />
          </div>

          {/* Table */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {tableTitle}
              </h3>
              <Tabs
                value={tableGran}
                onChange={(v) => setTableGran(v as typeof tableGran)}
                options={["Day", "Week", "Month"]}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="py-4 pl-6 pr-4 text-left text-sm font-semibold text-slate-700">
                        {tableGran === "Day" ? "Date" : "Period"}
                      </th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-slate-700">
                        Interest Earned (BTNC)
                      </th>
                      <th className="py-4 pr-6 pl-4 text-right text-sm font-semibold text-slate-700">
                        Cumulative Interest (BTNC)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableRows.map((r, idx) => (
                      <motion.tr
                        key={`${r.dateStr}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group hover:bg-slate-50/50 transition-colors duration-200"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <span className="text-sm font-medium text-slate-900">
                            {r.dateStr}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-semibold text-emerald-600">
                            {nf4.format(r.interestEarned)}
                          </span>
                        </td>
                        <td className="py-4 pr-6 pl-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {nf4.format(r.cumulative)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden mt-6 space-y-3">
              {tableRows.slice(0, 5).map((r, idx) => (
                <motion.div
                  key={`mobile-${r.dateStr}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {r.dateStr}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      +{nf4.format(r.interestEarned)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Cumulative:{" "}
                    <span className="font-semibold text-slate-900">
                      {nf4.format(r.cumulative)} BTNC
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}