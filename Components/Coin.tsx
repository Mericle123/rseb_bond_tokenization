"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Copy,
  Send as SendIcon,
  Ticket,
  ShoppingCart,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  X,
  QrCode,
  Camera,
} from "lucide-react";
import { buyBtn, getUserFromAddress } from "../server/blockchain/btnc";
import { useCurrentUser } from "@/context/UserContext";
import { getBtncBalance } from "../server/blockchain/btnc";
import { transBtn } from "../server/blockchain/btnc";

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

type View =
  | null
  | "receive"
  | "send"
  | "redeem-amount"
  | "redeem-bank"
  | "redeem-otp"
  | "buy-amount"
  | "buy-bank"
  | "buy-otp"
  | "scan-qr";

// Enhanced modal variants from assets page
const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

/* =================================================================== */
/*                           LOADING ANIMATION                         */
/* =================================================================== */

function WalletLoadingAnimation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="loader-container mx-auto mb-8">
          <svg
            id="svg_svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 477 578"
            height="578"
            width="477"
            className="w-48 h-48"
          >
            <g filter="url(#filter0_i_163_1030)">
              <path
                fill="#E9E9E9"
                d="M235.036 304.223C236.949 303.118 240.051 303.118 241.964 304.223L470.072 435.921C473.898 438.13 473.898 441.712 470.072 443.921L247.16 572.619C242.377 575.38 234.623 575.38 229.84 572.619L6.92817 443.921C3.10183 441.712 3.10184 438.13 6.92817 435.921L235.036 304.223Z"
              ></path>
            </g>
            <path
              stroke="white"
              d="M235.469 304.473C237.143 303.506 239.857 303.506 241.531 304.473L469.639 436.171C473.226 438.242 473.226 441.6 469.639 443.671L246.727 572.369C242.183 574.992 234.817 574.992 230.273 572.369L7.36118 443.671C3.77399 441.6 3.774 438.242 7.36119 436.171L235.469 304.473Z"
            ></path>
            <path
              stroke="white"
              fill="#C3CADC"
              d="M234.722 321.071C236.396 320.105 239.111 320.105 240.785 321.071L439.477 435.786C443.064 437.857 443.064 441.215 439.477 443.286L240.785 558.001C239.111 558.967 236.396 558.967 234.722 558.001L36.0304 443.286C32.4432 441.215 32.4432 437.857 36.0304 435.786L234.722 321.071Z"
            ></path>
            <path
              fill="#4054B2"
              d="M234.521 366.089C236.434 364.985 239.536 364.985 241.449 366.089L406.439 461.346L241.247 556.72C239.333 557.825 236.231 557.825 234.318 556.72L69.3281 461.463L234.521 366.089Z"
            ></path>
            <path
              fill="#30439B"
              d="M237.985 364.089L237.984 556.972C236.144 556.941 235.082 556.717 233.13 556.043L69.3283 461.463L237.985 364.089Z"
            ></path>
            <path
              fill="url(#paint0_linear_163_1030)"
              d="M36.2146 117.174L237.658 0.435217V368.615C236.541 368.598 235.686 368.977 233.885 370.124L73.1836 463.678L39.2096 444.075C37.0838 442.229 36.285 440.981 36.2146 438.027V117.174Z"
              id="layer_pared"
            ></path>
            <path
              fill="url(#paint1_linear_163_1030)"
              d="M439.1 116.303L237.657 0.435568V368.616C238.971 368.585 239.822 369.013 241.43 370.135L403.64 462.925L436.128 444.089C437.832 442.715 438.975 441.147 439.1 439.536V116.303Z"
              id="layer_pared"
            ></path>
            <path
              fill="#27C6FD"
              d="M64.5447 181.554H67.5626V186.835L64.5447 188.344V181.554Z"
              id="float_server"
            ></path>
            <path
              fill="#138EB9"
              d="M88.3522 374.347L232.415 457.522C234.202 458.405 234.866 458.629 236.335 458.71V468.291C235.356 468.291 234.086 468.212 232.415 467.275L88.3522 384.1C86.3339 382.882 85.496 382.098 85.4707 380.198V370.428L88.3522 374.347Z"
              id="float_server"
            ></path>
            <path
              fill="#138EB9"
              d="M384.318 374.445L240.254 457.62C238.914 458.385 238.295 458.629 236.335 458.71V468.291C237.315 468.291 238.704 468.211 240.236 467.274L384.318 384.198C386.457 383.091 387.151 382.244 387.258 380.228V370.917C386.768 372.387 386.21 373.295 384.318 374.445Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint3_linear_163_1030)"
              fill="url(#paint2_linear_163_1030)"
              d="M240.452 226.082L408.617 323.172C412.703 325.531 412.703 329.355 408.617 331.713L240.452 428.803C238.545 429.904 235.455 429.904 233.548 428.803L65.3832 331.713C61.298 329.355 61.298 325.531 65.3832 323.172L233.548 226.082C235.455 224.982 238.545 224.982 240.452 226.082Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M408.896 332.123L241.489 428.775C240.013 429.68 238.557 430.033 236.934 430.033V464.518C238.904 464.518 239.366 464.169 241.489 463.233L408.896 366.58C411.372 365.292 412.125 363.262 412.312 361.317C412.312 361.317 412.312 326.583 412.312 327.722C412.312 328.86 411.42 330.514 408.896 332.123Z"
              id="float_server"
            ></path>
            <path
              fill="#6879AF"
              d="M240.92 429.077L255.155 420.857V432.434L251.511 439.064V457.432L241.489 463.242C240.116 463.858 239.141 464.518 236.934 464.518V430.024C238.695 430.024 239.862 429.701 240.92 429.077Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint4_linear_163_1030)"
              d="M65.084 331.984L232.379 428.571C233.882 429.619 235.101 430.005 236.934 430.005V464.523C234.656 464.523 234.285 464.215 232.379 463.214L65.084 366.442C62.4898 365 61.6417 362.992 61.6699 361.29V327.125C61.6899 329.24 62.4474 330.307 65.084 331.984Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M400.199 361.032C403.195 359.302 405.623 355.096 405.623 351.637C405.623 348.177 403.195 346.775 400.199 348.505C397.203 350.235 394.775 354.441 394.775 357.9C394.775 361.359 397.203 362.762 400.199 361.032Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M221.404 446.444C224.4 448.174 226.828 446.771 226.828 443.312C226.828 439.853 224.4 435.646 221.404 433.917C218.408 432.187 215.979 433.589 215.979 437.049C215.979 440.508 218.408 444.714 221.404 446.444Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M102.895 359.589L97.9976 356.762V380.07L102.895 382.897V359.589Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M102.895 359.619L98.3394 356.989V379.854L102.895 382.484V359.619Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M78.9793 345.923L74.0823 343.096V366.37L78.9793 369.198V345.923Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M86.9512 350.478L82.0542 347.651V370.959L86.9512 373.787V350.478Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M94.9229 355.034L90.0259 352.206V375.515L94.9229 378.342V355.034Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M86.951 350.509L82.3958 347.879V370.743L86.951 373.373V350.509Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M94.9227 355.064L90.3674 352.434V375.299L94.9227 377.929V355.064Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#313654"
              d="M78.9794 345.954L74.4241 343.324V366.188L78.9794 368.818V345.954Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#333B5F"
              d="M221.859 446.444C224.855 448.174 227.284 446.771 227.284 443.312C227.284 439.853 224.855 435.646 221.859 433.917C218.863 432.187 216.435 433.589 216.435 437.049C216.435 440.508 218.863 444.714 221.859 446.444Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M399.516 361.032C402.511 359.302 404.94 355.096 404.94 351.637C404.94 348.177 402.511 346.775 399.516 348.505C396.52 350.235 394.091 354.441 394.091 357.9C394.091 361.359 396.52 362.762 399.516 361.032Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M88.3522 317.406L232.415 400.581C234.202 401.464 234.866 401.688 236.335 401.769V411.35C235.356 411.35 234.086 411.271 232.415 410.334L88.3522 327.159C86.3339 325.941 85.496 325.157 85.4707 323.256V313.486L88.3522 317.406Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M384.318 317.504L240.254 400.679C238.914 401.444 238.295 401.688 236.335 401.769V411.35C237.315 411.35 238.704 411.27 240.236 410.333L384.318 327.257C386.457 326.15 387.151 325.303 387.258 323.287V313.976C386.768 315.446 386.21 316.354 384.318 317.504Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint6_linear_163_1030)"
              fill="url(#paint5_linear_163_1030)"
              d="M240.452 169.141L408.617 266.231C412.703 268.59 412.703 272.414 408.617 274.772L240.452 371.862C238.545 372.962 235.455 372.962 233.548 371.862L65.3832 274.772C61.298 272.414 61.298 268.59 65.3832 266.231L233.548 169.141C235.455 168.04 238.545 168.04 240.452 169.141Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M408.896 275.182L241.489 371.834C240.013 372.739 238.557 373.092 236.934 373.092V407.577C238.904 407.577 239.366 407.229 241.489 406.292L408.896 309.64C411.372 308.352 412.125 306.321 412.312 304.376C412.312 304.376 412.312 269.642 412.312 270.781C412.312 271.92 411.42 273.573 408.896 275.182Z"
              id="float_server"
            ></path>
            <path
              fill="#6879AF"
              d="M240.92 372.135L255.155 363.915V375.493L251.511 382.123V400.491L241.489 406.3C240.116 406.916 239.141 407.577 236.934 407.577V373.083C238.695 373.083 239.862 372.759 240.92 372.135Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint7_linear_163_1030)"
              d="M65.084 275.043L232.379 371.63C233.882 372.678 235.101 373.064 236.934 373.064V407.582C234.656 407.582 234.285 407.274 232.379 406.273L65.084 309.501C62.4898 308.059 61.6417 306.051 61.6699 304.349V270.184C61.6899 272.299 62.4474 273.366 65.084 275.043Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M400.199 304.091C403.195 302.362 405.623 298.155 405.623 294.696C405.623 291.237 403.195 289.835 400.199 291.564C397.203 293.294 394.775 297.5 394.775 300.959C394.775 304.419 397.203 305.821 400.199 304.091Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M221.404 389.503C224.4 391.232 226.828 389.83 226.828 386.371C226.828 382.912 224.4 378.705 221.404 376.976C218.408 375.246 215.979 376.648 215.979 380.107C215.979 383.567 218.408 387.773 221.404 389.503Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M102.553 301.281L97.656 298.454V321.762L102.553 324.59V301.281Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M102.553 301.312L97.9976 298.682V321.546L102.553 324.176V301.312Z"
              className="estrobo_animation"
            ></path>
            <path
              fill="#494F76"
              d="M78.6377 287.615L73.7407 284.788V308.063L78.6377 310.89V287.615Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M86.6094 292.171L81.7124 289.343V312.652L86.6094 315.479V292.171Z"
              id="float_server"
            ></path>
            <path
              fill="#494F76"
              d="M94.5811 296.726L89.6841 293.899V317.207L94.5811 320.034V296.726Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M86.6095 292.201L82.0542 289.571V312.436L86.6095 315.066V292.201Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M94.5812 296.756L90.0259 294.126V316.991L94.5812 319.621V296.756Z"
              className="estrobo_animationV2"
            ></path>
            <path
              fill="#313654"
              d="M78.6376 287.646L74.0823 285.016V307.88L78.6376 310.51V287.646Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M221.859 389.503C224.855 391.232 227.284 389.83 227.284 386.371C227.284 382.912 224.855 378.705 221.859 376.976C218.863 375.246 216.435 376.648 216.435 380.107C216.435 383.567 218.863 387.773 221.859 389.503Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M399.516 304.091C402.511 302.362 404.94 298.155 404.94 294.696C404.94 291.237 402.511 289.835 399.516 291.564C396.52 293.294 394.091 297.5 394.091 300.959C394.091 304.419 396.52 305.821 399.516 304.091Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M89.4907 214.912L233.554 298.087C235.341 298.97 236.003 299.194 237.474 299.275V308.856C236.494 308.856 235.223 308.777 233.554 307.84L89.4907 224.665C87.4726 223.447 86.6347 222.663 86.6094 220.762V210.993L89.4907 214.912Z"
              id="float_server"
            ></path>
            <path
              fill="#27C6FD"
              d="M385.457 215.01L241.393 298.185C240.053 298.951 239.434 299.194 237.474 299.275V308.856C238.454 308.856 239.844 308.776 241.375 307.839L385.457 224.763C387.597 223.656 388.29 222.809 388.397 220.793V211.482C387.907 212.953 387.349 213.86 385.457 215.01Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint8_linear_163_1030)"
              d="M66.1102 196.477L233.517 293.129C235.593 294.154 236.364 294.416 238.073 294.509V305.642C236.934 305.642 235.458 305.551 233.517 304.463L66.1102 207.81C63.7651 206.394 62.7914 205.483 62.762 203.275V191.922L66.1102 196.477Z"
              id="float_server"
            ></path>
            <path
              fill="#5B6CA2"
              d="M410.101 196.591L242.694 293.243C241.135 294.132 240.35 294.375 238.073 294.468V305.643C239.211 305.643 240.892 305.55 242.671 304.46L410.101 207.923C412.587 206.638 413.392 205.653 413.517 203.31V192.491C412.948 194.199 412.3 195.254 410.101 196.591Z"
              id="float_server"
            ></path>
            <path
              stroke="url(#paint10_linear_163_1030)"
              fill="url(#paint9_linear_163_1030)"
              d="M241.59 90.5623L409.756 187.652C413.842 190.011 413.842 193.835 409.756 196.194L241.59 293.284C239.684 294.384 236.593 294.384 234.687 293.284L66.5219 196.194C62.4367 193.835 62.4367 190.011 66.5219 187.652L234.687 90.5623C236.593 89.4616 239.684 89.4616 241.59 90.5623Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M89.0427 195.334C92.0385 197.063 96.8956 197.063 99.8914 195.334C102.887 193.604 102.887 190.8 99.8914 189.07C96.8956 187.341 92.0385 187.341 89.0427 189.07C86.0469 190.8 86.0469 193.604 89.0427 195.334Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M231.396 111.061C234.391 112.791 239.249 112.791 242.244 111.061C245.24 109.331 245.24 106.527 242.244 104.798C239.249 103.068 234.391 103.068 231.396 104.798C228.4 106.527 228.4 109.331 231.396 111.061Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M374.887 194.195C377.883 195.925 382.74 195.925 385.736 194.195C388.732 192.465 388.732 189.661 385.736 187.932C382.74 186.202 377.883 186.202 374.887 187.932C371.891 189.661 371.891 192.465 374.887 194.195Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M231.396 279.607C234.391 281.336 239.249 281.336 242.244 279.607C245.24 277.877 245.24 275.073 242.244 273.343C239.249 271.613 234.391 271.613 231.396 273.343C228.4 275.073 228.4 277.877 231.396 279.607Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M232.109 279.607C235.104 281.336 239.962 281.336 242.957 279.607C245.953 277.877 245.953 275.073 242.957 273.343C239.962 271.613 235.104 271.613 232.109 273.343C229.113 275.073 229.113 277.877 232.109 279.607Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M89.7563 195.334C92.7521 197.063 97.6092 197.063 100.605 195.334C103.601 193.604 103.601 190.8 100.605 189.07C97.6092 187.341 92.7521 187.341 89.7563 189.07C86.7605 190.8 86.7605 193.604 89.7563 195.334Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M232.109 111.061C235.104 112.791 239.962 112.791 242.957 111.061C245.953 109.331 245.953 106.527 242.957 104.798C239.962 103.068 235.104 103.068 232.109 104.798C229.113 106.527 229.113 109.331 232.109 111.061Z"
              id="float_server"
            ></path>
            <path
              fill="#333B5F"
              d="M375.6 194.195C378.595 195.925 383.453 195.925 386.448 194.195C389.444 192.465 389.444 189.661 386.448 187.932C383.453 186.202 378.595 186.202 375.6 187.932C372.604 189.661 372.604 192.465 375.6 194.195Z"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M371.315 166.009L354.094 176.748C351.92 178.337 350.677 179.595 350.677 181.872L351.247 196.108C351.412 198.824 350.734 200.095 347.83 201.802L251.03 257.603C248.955 258.968 247.598 259.356 244.767 259.312L215.727 258.743C212.711 258.605 211.233 259.005 208.894 260.45L193.659 269.072"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M345.691 151.204L328.328 161.374C326.154 162.963 324.911 164.221 324.911 166.498L325.481 180.734C325.646 183.45 324.968 184.721 322.064 186.428L225.264 242.229C223.19 243.594 221.832 243.982 219.001 243.938L189.961 243.369C186.946 243.231 185.468 243.631 183.128 245.076L167.124 253.698"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M105.482 218.098L122.697 207.363C124.87 205.773 126.111 204.516 126.111 202.24L125.537 188.007C125.371 185.291 126.048 184.02 128.951 182.314L225.715 126.533C227.788 125.17 229.146 124.782 231.976 124.825L261.012 125.398C264.026 125.535 265.503 125.136 267.842 123.691L283.072 115.072"
              id="float_server"
            ></path>
            <path
              stroke="#313654"
              d="M131.121 232.893L148.482 222.725C150.656 221.136 151.898 219.879 151.898 217.601L151.327 203.367C151.162 200.65 151.839 199.379 154.743 197.673L251.531 141.878C253.605 140.514 254.962 140.126 257.794 140.17L286.832 140.74C289.847 140.878 291.325 140.478 293.664 139.032L309.667 130.412"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M327.961 242.79L301.907 227.748L300.673 228.46L326.727 243.503L327.961 242.79Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M354.625 227.426L328.56 212.377L327.326 213.09L353.392 228.139L354.625 227.426Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M300.864 258.519L274.707 243.417L273.474 244.129L299.631 259.231L300.864 258.519Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M176.498 155.101L150.21 139.924L148.977 140.636L175.264 155.813L176.498 155.101Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M193.703 145.191L167.388 129.998L166.154 130.711L192.469 145.903L193.703 145.191Z"
              id="float_server"
            ></path>
            <path
              fill="#313654"
              d="M158.333 165.69L131.974 150.472L130.74 151.184L157.099 166.402L158.333 165.69Z"
              id="float_server"
            ></path>
            <path
              fill="#20273A"
              d="M232.079 135.83C234.258 134.573 237.79 134.573 239.969 135.83L329.717 187.647C334.074 190.163 334.074 194.242 329.717 196.757L239.969 248.574C237.79 249.832 234.258 249.832 232.079 248.574L142.33 196.757C137.972 194.242 137.972 190.163 142.33 187.647L232.079 135.83Z"
              id="float_server"
            ></path>
            <path
              fill="url(#paint11_linear_163_1030)"
              d="M234.357 135.83C236.535 134.573 240.068 134.573 242.246 135.83L331.995 187.647C336.352 190.163 336.352 194.242 331.995 196.757L242.246 248.574C240.068 249.832 236.535 249.832 234.357 248.574L144.608 196.757C140.25 194.242 140.25 190.163 144.608 187.647L234.357 135.83Z"
              id="float_server"
            ></path>
            <path
              stroke-width="3"
              stroke="#27C6FD"
              d="M380.667 192.117V181.97C380.667 179.719 383.055 178.27 385.052 179.309L409.985 192.282C410.978 192.799 411.601 193.825 411.601 194.943V301.113C411.601 302.642 409.953 303.606 408.62 302.856L399.529 297.742"
              className="after_animation"
              id="float_server"
            ></path>
            <path
              stroke-width="3"
              stroke="#27C6FD"
              d="M94.7234 192.117V180.306C94.7234 179.214 94.1301 178.208 93.1744 177.68L70.5046 165.152C68.5052 164.047 66.0536 165.493 66.0536 167.778V185.326"
              id="float_server"
            ></path>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="192.117"
              cx="380.667"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="192.117"
              cx="94.7235"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="297.742"
              cx="399.529"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="383.751"
              cx="221.474"
              id="float_server"
            ></ellipse>
            <ellipse
              fill="#27C6FD"
              ry="1.50894"
              rx="1.50894"
              cy="439.583"
              cx="221.474"
              id="float_server"
            ></ellipse>
            <path
              stroke-width="3"
              stroke="#27C6FD"
              d="M221.474 383.752L211.746 388.941C210.768 389.462 210.157 390.48 210.157 391.588V444.34C210.157 445.108 210.988 445.589 211.654 445.208L221.474 439.583"
              id="float_server"
            ></path>
            <path
              fill="url(#paint13_linear_163_1030)"
              d="M237.376 236.074L36 119.684V439.512C36.0957 441.966 36.7214 443.179 39.0056 445.021L200.082 538.547L231.362 556.441C233.801 557.806 235.868 558.222 237.376 558.328V236.074Z"
              id="layer_pared"
            ></path>
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="556.454"
                x2="438.984"
                y1="235.918"
                x1="237.376"
                id="paint13_linear_163_1030"
              >
                <stop style={{stopColor:"#4457b3", stopOpacity:0}} offset="10%"></stop>
                <stop style={{stopColor:"#4457b3", stopOpacity:1}} offset="100%"></stop>
              </linearGradient>
            </defs>
            <path
              fill="url(#paint13_linear_163_1030)"
              d="M237.376 235.918L438.984 119.576V439.398C439.118 441.699 438.452 442.938 435.975 444.906L274.712 538.539L243.397 556.454C240.955 557.821 238.886 558.23 237.376 558.336V235.918Z"
              className="animatedStop"
              id="layer_pared"
            ></path>
            <defs>
              <filter
                color-interpolation-filters="sRGB"
                filterUnits="userSpaceOnUse"
                height="275.295"
                width="468.883"
                y="303.394"
                x="4.05835"
                id="filter0_i_163_1030"
              >
                <feFlood result="BackgroundImageFix" flood-opacity="0"></feFlood>
                <feBlend
                  result="shape"
                  in2="BackgroundImageFix"
                  in="SourceGraphic"
                  mode="normal"
                ></feBlend>
                <feColorMatrix
                  result="hardAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  type="matrix"
                  in="SourceAlpha"
                ></feColorMatrix>
                <feOffset dy="4"></feOffset>
                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                <feComposite
                  k3="1"
                  k2="-1"
                  operator="arithmetic"
                  in2="hardAlpha"
                ></feComposite>
                <feColorMatrix
                  values="0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 1 0"
                  type="matrix"
                ></feColorMatrix>
                <feBlend
                  result="effect1_innerShadow_163_1030"
                  in2="shape"
                  mode="normal"
                ></feBlend>
              </filter>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="336.055"
                x2="294.366"
                y1="60.1113"
                x1="135.05"
                id="paint0_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="335.208"
                x2="180.935"
                y1="59.2405"
                x1="340.265"
                id="paint1_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="420.619"
                x2="88.5367"
                y1="327.152"
                x1="412.313"
                id="paint2_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="211.092"
                x2="168.239"
                y1="426.799"
                x1="236.934"
                id="paint3_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="349.241"
                x2="232.379"
                y1="349.241"
                x1="65.0839"
                id="paint4_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="363.678"
                x2="88.5367"
                y1="270.211"
                x1="412.313"
                id="paint5_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="154.15"
                x2="168.239"
                y1="369.858"
                x1="236.934"
                id="paint6_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="292.3"
                x2="232.379"
                y1="292.3"
                x1="65.0839"
                id="paint7_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="198.899"
                x2="238.073"
                y1="198.899"
                x1="62.762"
                id="paint8_linear_163_1030"
              >
                <stop stopColor="#7382B9"></stop>
                <stop stopColor="#5D6EA4" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="191.599"
                x2="67.1602"
                y1="191.633"
                x1="413.451"
                id="paint9_linear_163_1030"
              >
                <stop stopColor="#5F6E99"></stop>
                <stop stopColor="#465282" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="191.599"
                x2="63.6601"
                y1="191.599"
                x1="417.16"
                id="paint10_linear_163_1030"
              >
                <stop stopColor="#7281B8"></stop>
                <stop stopColor="#333952" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="243.221"
                x2="156.734"
                y1="191.633"
                x1="335.442"
                id="paint11_linear_163_1030"
              >
                <stop stopColor="#313654"></stop>
                <stop stopColor="#313654" offset="1"></stop>
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                y2="421.983"
                x2="-1.9283"
                y1="179.292"
                x1="138.189"
                id="paint12_linear_163_1030"
              >
                <stop stopOpacity="0.01" stopColor="white" offset="0.305"></stop>
                <stop stopColor="#4054B2" offset="1"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Your Wallet</h2>
        <p className="text-gray-600">Please wait while we set up your wallet...</p>
        
        {/* Loading Animation Styles */}
        <style jsx>{`
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
          
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </div>
  );
}

/* =================================================================== */
/*                                MAIN                                  */
/* =================================================================== */
export default function WalletSection({
  walletAddress,
  mnemonics,
}: {
  walletAddress: string;
  mnemonics: string;
}) {
  const currentUser = useCurrentUser();

  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>(null);
  const [activeAction, setActiveAction] = useState<
    null | "send" | "redeem" | "buy" | "receive"
  >(null);

  // ✅ Enhanced success state with better structure
  const [successMessage, setSuccessMessage] = useState<null | {
    type: "send" | "buy" | "redeem";
    amount?: string;
    transactionHash?: string;
  }>(null);

  const timeoutRef = useRef<number | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to save wallet transactions to localStorage
  const saveWalletTransaction = useCallback((type: 'send' | 'buy' | 'redeem', amount: string, transactionHash?: string, recipient?: string) => {
    const transactionData = {
      id: `${type}-${Date.now()}`,
      type,
      amount,
      transactionHash,
      recipient,
      date: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('walletTransactions') || '[]');
    localStorage.setItem('walletTransactions', JSON.stringify([...existing, transactionData]));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('storage'));
  }, []);

  const copyMainAddr = useCallback(async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
  }, [walletAddress]);

  const openSheet = useCallback((v: Exclude<View, null>) => {
    setView(v);
    const map: Record<
      Exclude<View, null>,
      "send" | "redeem" | "buy" | "receive"
    > = {
      receive: "receive",
      send: "send",
      "redeem-amount": "redeem",
      "redeem-bank": "redeem",
      "redeem-otp": "redeem",
      "buy-amount": "buy",
      "buy-bank": "buy",
      "buy-otp": "buy",
      "scan-qr": "send",
    };
    setActiveAction(map[v]);
    setOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setView(null);
      setActiveAction(null);
    }, 250);
  }, []);

  // helper to reload balance (also used after buy/send)
  const loadBalanceFor = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const data = await getBtncBalance({ address });
      setBalance(data.balanceHuman);
    } catch (e) {
      console.error("Failed to load balance:", e);
      setBalance("0");
    } finally {
      setLoading(false);
      setPageLoaded(true);
    }
  }, []);

  // Load balance only when walletAddress changes and component is mounted
  useEffect(() => {
    if (walletAddress && isClient) {
      // Simulate initial page load delay
      const timer = setTimeout(() => {
        loadBalanceFor(walletAddress);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [walletAddress, isClient, loadBalanceFor]);

  // Format wallet address for display
  const formatWalletAddress = useCallback((address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }, []);

  // Memoized display values to prevent unnecessary recalculations
  const displayBalance = useMemo(() => {
    if (!isClient || !pageLoaded) {
      return <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>;
    }
    
    if (loading) {
      return "Loading balance...";
    }
    
    if (balance && parseFloat(balance) > 0) {
      return (
        <>
          {balance}{" "}
          <span className="text-lg sm:text-xl font-medium text-gray-500">
            BTN₵
          </span>
        </>
      );
    }
    
    return "No coins";
  }, [isClient, loading, balance, pageLoaded]);

  const displayBalanceText = useMemo(() => {
    if (!isClient || !pageLoaded) {
      return <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto mt-2"></div>;
    }
    
    if (loading) {
      return "Please wait...";
    }
    
    if (balance && parseFloat(balance) > 0) {
      return "Your current BTN₵ balance";
    }
    
    return "Once you have purchased or received coins, they will appear here.";
  }, [isClient, loading, balance, pageLoaded]);

  // Show loading animation while page is loading
  if (!pageLoaded) {
    return <WalletLoadingAnimation />;
  }

  return (
    <>
      {/* ===== Wallet summary card ===== */}
      <motion.section
        {...fadeIn}
        className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden mx-4 sm:mx-0"
        aria-labelledby="wallet-summary-title"
      >
        {/* Address Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-black/5 bg-gradient-to-b from-white to-white/80">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-800">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B50D9]" strokeWidth={1.75} />
            </span>
            <span className="font-medium whitespace-nowrap">Your wallet:</span>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-black/5">
              <code className="text-gray-700 break-all text-xs sm:text-sm font-mono">
                {formatWalletAddress(walletAddress)}
              </code>
              <button
                type="button"
                onClick={copyMainAddr}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                aria-label="Copy wallet address"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => openSheet("receive")}
              className="group inline-flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all whitespace-nowrap"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Receive</span>
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? "Wallet address copied" : ""}
            </span>
          </div>
        </div>

        {/* Empty State + Actions */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-2xl border border-black/10 bg-white/60 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
            <div className="p-6 sm:p-8 lg:p-10 text-center">
              {/* Coin icon pill - Fixed aspect ratio warning */}
              <div className="mx-auto mb-4 sm:mb-6 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
                <Image 
                  src="/coin.png" 
                  alt="coin" 
                  width={32} 
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <h2
                id="wallet-summary-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
              >
                {displayBalance}
              </h2>

              <div className="mt-2 text-sm sm:text-base text-gray-600">
                {displayBalanceText}
              </div>

              {/* Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
                <ActionButton
                  label="Send"
                  icon={SendIcon}
                  active={activeAction === "send"}
                  onClick={() => openSheet("send")}
                />
                <ActionButton
                  label="Redeem"
                  icon={Ticket}
                  active={activeAction === "redeem"}
                  onClick={() => openSheet("redeem-amount")}
                />
                <ActionButton
                  label="Buy"
                  icon={ShoppingCart}
                  active={activeAction === "buy"}
                  onClick={() => openSheet("buy-amount")}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== Slide-over sheet for all flows ===== */}
      <Sheet open={open} onClose={closeSheet} title={titleFor(view)} view={view} setView={setView}>
        {view === "receive" && <ReceiveView walletAddress={walletAddress} />}

        {view === "send" && (
          <SendView
            mnemonics={mnemonics}
            balance={balance ?? "0"}
            walletAddress={walletAddress}
            onScanQR={() => openSheet("scan-qr")}
            onSuccess={(res, amount, recipient) => {
              closeSheet();
              setSuccessMessage({
                type: "send",
                amount,
                transactionHash: res?.transactionHash || `0x${Math.random().toString(16).slice(2,42)}`
              });
              loadBalanceFor(walletAddress);
              saveWalletTransaction('send', amount, res?.transactionHash, recipient);
            }}
          />
        )}

        {view === "scan-qr" && (
          <ScanQRView
            onBack={() => openSheet("send")}
            onAddressScanned={(address) => {
              closeSheet();
              openSheet("send");
              sessionStorage.setItem('scannedWalletAddress', address);
            }}
          />
        )}

        {view === "redeem-amount" && (
          <RedeemAmount onNext={() => setView("redeem-bank")} />
        )}

        {view === "redeem-bank" && (
          <RedeemBank 
            onBack={() => setView("redeem-amount")} 
            onNext={() => setView("redeem-otp")}
          />
        )}

        {view === "redeem-otp" && (
          <RedeemOtp 
            onBack={() => setView("redeem-bank")}
            onSuccess={(amount) => {
              closeSheet();
              setSuccessMessage({
                type: "redeem",
                amount,
                transactionHash: `0x${Math.random().toString(16).slice(2,42)}`
              });
              loadBalanceFor(walletAddress);
              saveWalletTransaction('redeem', amount, `0x${Math.random().toString(16).slice(2,42)}`);
            }}
          />
        )}

        {view === "buy-amount" && (
          <BuyAmount
            balance={balance ?? "0"}
            walletAddress={walletAddress}
            onSuccess={(amount) => {
              closeSheet();
              setSuccessMessage({ 
                type: "buy",
                amount,
                transactionHash: `0x${Math.random().toString(16).slice(2,42)}`
              });
              loadBalanceFor(walletAddress);
              saveWalletTransaction('buy', amount, `0x${Math.random().toString(16).slice(2,42)}`);
            }}
          />
        )}

        {view === "buy-bank" && (
          <BuyBank
            walletAddress={walletAddress}
            onBack={() => setView("buy-amount")}
            onNext={() => setView("buy-otp")}
          />
        )}

        {view === "buy-otp" && <BuyOtp onBack={() => setView("buy-bank")} />}
      </Sheet>

      {/* ✅ Enhanced Success Toast */}
      <EnhancedSuccessToast 
        successMessage={successMessage} 
        onClose={() => setSuccessMessage(null)} 
      />
    </>
  );
}

/* =================================================================== */
/*                     ENHANCED SUCCESS TOAST                          */
/* =================================================================== */

function EnhancedSuccessToast({ 
  successMessage, 
  onClose 
}: { 
  successMessage: null | {
    type: "send" | "buy" | "redeem";
    amount?: string;
    transactionHash?: string;
  };
  onClose: () => void;
}) {
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  const getMessage = useCallback(() => {
    if (!successMessage) return "";
    
    const amount = successMessage.amount ? `${successMessage.amount} ` : "";
    
    switch (successMessage.type) {
      case "send": return `Sent ${amount}BTN₵ successfully!`;
      case "buy": return `Purchased ${amount}BTN₵ successfully!`;
      case "redeem": return `Redeemed ${amount}BTN₵ successfully!`;
      default: return "Operation completed successfully!";
    }
  }, [successMessage]);

  if (!successMessage) return null;

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[1px]"
          onClick={onClose}
        />
        
        {/* Toast */}
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="relative rounded-2xl shadow-xl overflow-hidden border border-gray-200 bg-white">
              
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-r from-white to-white/80 border-b border-gray-200">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {successMessage.type === "send" ? "Transfer Successful" : 
                       successMessage.type === "buy" ? "Purchase Successful" : "Redemption Successful"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {getMessage()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="space-y-3 text-sm">
                    {successMessage.amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-gray-900">
                          {successMessage.amount} BTN₵
                        </span>
                      </div>
                    )}
                    {successMessage.transactionHash && (
                      <div>
                        <p className="text-gray-600 mb-2">Transaction Hash:</p>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <code className="text-xs text-gray-800 break-all font-mono">
                            {successMessage.transactionHash}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Updated Button Color */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-[#5B50D9] hover:bg-[#4a46c4] text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
}

/* =================================================================== */
/*                           SHARED COMPONENTS                          */
/* =================================================================== */

function ActionButton({
  label,
  icon: Icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 text-base font-semibold ring-1 ring-black/10 transition-all duration-200";

  const skin = active
    ? "bg-[#5B50D9] text-white hover:opacity-95 shadow-lg"
    : "bg-white text-gray-900 hover:ring-black/20 shadow-sm hover:shadow-md hover:scale-[1.02]";

  const iconWrap = active
    ? "bg-white/10 ring-1 ring-white/20"
    : "bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20";

  const iconColor = active ? "text-white" : "text-[#5B50D9]";

  return (
    <button type="button" onClick={onClick} className={`${base} ${skin}`}>
      <span className={`grid place-items-center w-8 h-8 sm:w-9 sm:h-9 rounded-full ${iconWrap}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} />
      </span>
      {label}
    </button>
  );
}

function Sheet({
  open,
  onClose,
  title,
  children,
  view,
  setView,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
}) {
  const firstRef = useRef<HTMLButtonElement | null>(null);
  
  useEffect(() => {
    if (!open) return;
    
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstRef.current?.focus(), 0);
    
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Handle back button based on current view
  const handleBack = () => {
    if (view === "redeem-bank" || view === "buy-bank") {
      setView("redeem-amount");
    } else if (view === "redeem-otp") {
      setView("redeem-bank");
    } else if (view === "buy-otp") {
      setView("buy-bank");
    } else if (view === "scan-qr") {
      setView("send");
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          "absolute right-0 top-0 h-full",
          "w-full sm:w-[420px] lg:w-[480px]",
          "bg-white border-l border-black/10",
          "rounded-l-0 sm:rounded-l-[18px]",
          "shadow-[0_12px_40px_rgba(0,0,0,0.10)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
          "will-change-transform",
        ].join(" ")}
      >
        <div className="relative flex items-center border-b border-black/10 px-4 sm:px-6 py-4">
          <button
            ref={firstRef}
            onClick={handleBack}
            aria-label="Back"
            className="relative z-20 p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
            type="button"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-lg sm:text-xl font-medium tracking-[0.2px] pointer-events-none">
            {title ?? ""}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </div>
      </aside>
    </div>
  );
}

function titleFor(v: View) {
  switch (v) {
    case "receive":
      return "Receive";
    case "send":
      return "Send";
    case "scan-qr":
      return "Scan QR Code";
    case "redeem-amount":
    case "redeem-bank":
    case "redeem-otp":
      return "Redeem";
    case "buy-amount":
    case "buy-bank":
    case "buy-otp":
      return "Buy";
    default:
      return "";
  }
}

/* =================================================================== */
/*                          LOADING ANIMATION                          */
/* =================================================================== */

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="loader">
        <style>{`
          .loader {
            width: 120px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
          }
          .loader::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            animation: loading-shimmer 1.5s infinite;
            border-radius: 4px;
          }
          @keyframes loading-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
      <span className="text-white text-sm font-medium">Processing...</span>
    </div>
  );
}

/* =================================================================== */
/*                                 VIEWS                                */
/* =================================================================== */

// RECEIVE – QR + copy
function ReceiveView({ walletAddress }: { walletAddress: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Generate QR code using an external service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletAddress)}`;

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[360px] w-full">
        <LogoBlob />
        <div className="rounded-2xl border border-black/10 bg-white p-4 mx-auto w-full max-w-[280px] shadow-sm">
          <img
            src={qrCodeUrl}
            alt="QR code for wallet address"
            className="rounded-xl border border-black/10 w-full h-auto"
          />
        </div>

        <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-xl border border-black/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Wallet Address</p>
            <button
              onClick={copy}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              aria-label="Copy address"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <p className="text-sm font-mono break-all bg-white p-3 rounded-lg border border-black/5">
            {formatWalletAddress(walletAddress)}
          </p>
          {copied && (
            <p className="mt-2 text-sm text-green-600 text-center">Copied to clipboard!</p>
          )}
        </div>

        <button
          onClick={copy}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          {copied ? "Copied!" : "Copy Address"}
        </button>
      </div>
    </div>
  );
}

// SCAN QR VIEW
function ScanQRView({ 
  onBack, 
  onAddressScanned 
}: { 
  onBack: () => void; 
  onAddressScanned: (address: string) => void;
}) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simple manual input fallback
  const [manualAddress, setManualAddress] = useState("");

  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Cannot access camera. Please enter address manually.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onAddressScanned(manualAddress.trim());
    } else {
      setError("Please enter a wallet address");
    }
  };

  // Simulate QR code scanning (in a real app, you'd use a QR library)
  const simulateQRScan = () => {
    const sampleAddress = "0x742d35Cc6634C0532925a3b8D4BDesample12345678";
    onAddressScanned(sampleAddress);
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        
        <h3 className="mt-6 text-2xl font-bold text-center">Scan QR Code</h3>
        <p className="mt-2 text-base text-black/60 text-center">
          Point your camera at a wallet QR code to scan the address
        </p>

        {/* Camera Preview */}
        <div className="mt-6 relative bg-black rounded-2xl overflow-hidden aspect-square">
          {scanning ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Camera className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* QR Scanner Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/80 rounded-xl relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Simulate Scan Button (for demo) */}
        <button
          onClick={simulateQRScan}
          className="mt-4 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Simulate QR Scan (Demo)
        </button>

        {/* Manual Input Fallback */}
        <div className="mt-6">
          <label className="block text-base font-medium text-black/60 mb-2">
            Or Enter Address Manually
          </label>
          <input
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            placeholder="0x..."
          />
          <button
            onClick={handleManualSubmit}
            className="mt-3 w-full rounded-full bg-gray-600 text-white py-3 font-semibold text-lg hover:bg-gray-700 transition-colors"
          >
            Use Manual Address
          </button>
        </div>

        {error && (
          <p className="mt-4 text-base p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center">
            {error}
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-6 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back to Send
        </button>
      </div>
    </div>
  );
}

// SEND – amount + recipient (updated with QR scan)
function SendView({
  walletAddress,
  balance,
  mnemonics,
  onScanQR,
  onSuccess,
}: {
  walletAddress: string;
  balance: string;
  mnemonics: string;
  onScanQR: () => void;
  onSuccess?: (res: any, amount?: string, recipient?: string) => void;
}) {
  const currentUser = useCurrentUser();
  const mnemonic = currentUser.hashed_mnemonic;

  const [sender] = useState(walletAddress);
  const [to, setTo] = useState<string | null>("");
  const [amt, setAmt] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>();

  // Check for scanned address from QR
  useEffect(() => {
    const scannedAddress = sessionStorage.getItem('scannedWalletAddress');
    if (scannedAddress) {
      setTo(scannedAddress);
      sessionStorage.removeItem('scannedWalletAddress');
    }
  }, []);

  async function handleSend() {
    setMessage(null);

    if (!to || !amt) {
      setMessage("Please fill in all fields.");
      return;
    }
    const toUserId = await getUserFromAddress(to)

    try {
      setLoading(true);
      const res = await transBtn({
        mnemonics: mnemonic,
        sender: sender.trim(),
        toAddress: to.trim(),
        amountBTNC: amt,
        fromUserId: currentUser.id,
        toUserId: toUserId,
      });

      if (res.ok) {
        setMessage(null);
        onSuccess?.(res, amt, to);
        setTo("");
        setAmt("");
      } else {
        setMessage(`❌ ${res.detail || "Transfer failed"}`);
      }
    } catch (e: any) {
      console.error("SendView error:", e);
      setMessage(`⚠️ ${e.message || "Unexpected error"}`);
    } finally {
      setLoading(false);
    }
  }

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70">
            <span className="font-semibold">Your wallet</span>
            <br />
            {balance && parseFloat(balance) > 0 ? (
              <>
                {balance}{" "}
                <span className="text-sm font-medium text-gray-500">BTN₵</span>
              </>
            ) : (
              "No coins"
            )}
            <br />
            <span className="text-sm text-gray-600 break-all mt-2 inline-block">
              {formatWalletAddress(sender)}
            </span>
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">
          Transfer Your BTN Coin
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Coin Amount
            </label>
            <input
              value={amt ?? ""}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-medium text-black/60">
                Recipient Address
              </label>
              <button
                type="button"
                onClick={onScanQR}
                className="flex items-center gap-1 text-sm text-[#5B50D9] hover:text-[#4a46c4] transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Scan QR
              </button>
            </div>
            <input
              value={to ?? ""}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              placeholder="0x... or scan QR code"
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className={`mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg flex justify-center items-center gap-2 hover:bg-[#4a46c4] transition-colors shadow-lg min-h-[60px] ${
            loading ? "opacity-90 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Confirm Transfer"
          )}
        </button>

        {message && (
          <p
            className={`mt-4 text-base p-4 rounded-lg text-center ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : message.startsWith("⚠️")
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// REDEEM – step 1
function RedeemAmount({ onNext }: { onNext: () => void }) {
  const [amtCoin, setAmtCoin] = useState("");
  const [amtNu, setAmtNu] = useState("");

  function handleRedeemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setAmtCoin(value);

    const num = parseFloat(value);
    if (!isNaN(num)) {
      setAmtNu(value);
    } else {
      setAmtNu("");
    }
  }

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70 text-center">
            <span className="font-semibold">Your wallet has</span>
            <br />
            1000 coins
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">
          Amount to Redeem?
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Coin Amount
            </label>
            <input
              value={amtCoin}
              onChange={handleRedeemChange}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
            <p className="mt-2 text-sm text-black/60">
              1 BTN Coin = BTN Nu 1
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Redeem Amount (Nu)
            </label>
            <input
              value={amtNu}
              readOnly
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

// REDEEM – step 2
function RedeemBank({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const banks = demoBanks();
  const [openDD, setOpenDD] = useState(false);
  const [bank, setBank] = useState(banks[1]);
  const [acct, setAcct] = useState("");

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              1000 coins
            </p>
          </div>
          <h3 className="mt-6 text-2xl font-bold">Redeem to Bank</h3>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Select Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDD(!openDD)}
                className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base flex items-center justify-between hover:border-[#5B50D9] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <img src={bank.icon} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-base">{bank.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openDD ? 'rotate-180' : ''}`} />
              </button>
              {openDD && (
                <ul className="absolute z-10 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg max-h-64 overflow-y-auto">
                  {banks.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setBank(b);
                          setOpenDD(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={b.icon}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-base">{b.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-sm text-black/70">
              The coin will be redeemed and transferred to{" "}
              <span className="font-semibold">your {bank.name} account</span>.
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Account Number
            </label>
            <input
              placeholder="Account number"
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
          </div>
        </div>

        <hr className="my-6 border-black/10" />
        <div className="flex items-center justify-between text-base">
          <span>Total amount:</span>
          <span className="font-semibold">1000</span>
        </div>
        <p className="text-sm text-black/60 mt-1">(1 BTN coin = Nu 1)</p>

        <button 
          onClick={onNext}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Continue to OTP
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// REDEEM – step 3 (OTP STEP)
function RedeemOtp({ 
  onBack, 
  onSuccess 
}: { 
  onBack: () => void; 
  onSuccess?: (amount?: string) => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`redeem-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`redeem-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleRedeemConfirm = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess?.("1000"); // Pass the redeemed amount
    }, 2000);
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Redeeming</span>
              <br />
              1000 BTN₵
            </p>
          </div>

          <h3 className="mt-6 text-2xl font-bold">Enter OTP</h3>
          <p className="mt-2 text-base text-black/60">
            Please enter the 6-digit OTP sent to your registered mobile number
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`redeem-otp-${index}`}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border border-[#9DB6D3] text-center text-xl sm:text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              inputMode="numeric"
              maxLength={1}
              type="text"
            />
          ))}
        </div>

        <button className="mt-4 text-base text-[#5B50D9] hover:text-[#4a46c4] transition-colors font-medium">
          Resend OTP
        </button>

        <button
          onClick={handleRedeemConfirm}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg disabled:opacity-90 disabled:cursor-not-allowed min-h-[60px]"
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Confirm Redeem"
          )}
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 1
function BuyAmount({
  walletAddress,
  balance,
  onSuccess,
}: {
  walletAddress: string;
  balance: string;
  onSuccess?: (amount?: string) => void;
}) {
  const [coinbalance] = useState(balance);
  const [buy, setBuy] = useState("");
  const [spend, setSpend] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleBuy() {
    setMessage(null);

    const amountBTN = parseFloat(buy);
    if (isNaN(amountBTN) || amountBTN <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      await buyBtn(walletAddress, amountBTN);
      onSuccess?.(buy);
    } catch (e) {
      console.error("Buy failed:", e);
      setMessage("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBuyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setBuy(value);

    const num = parseFloat(value);
    if (!isNaN(num)) {
      setSpend(value);
    } else {
      setSpend("");
    }
  }

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
          <p className="text-base text-black/70 text-center">
            <span className="font-semibold">Your wallet has</span>
            <br />
            {loading ? (
              "Loading balance..."
            ) : coinbalance && parseFloat(coinbalance) > 0 ? (
              <>
                {coinbalance}{" "}
                <span className="text-sm font-medium text-gray-500">BTN₵</span>
              </>
            ) : (
              "No coins"
            )}
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-center">Buy BTN Coin</h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              You Buy
            </label>
            <input
              value={buy}
              onChange={handleBuyChange}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
            <p className="mt-2 text-sm text-black-60">1 BTN Coin = BTN 1</p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              You Spend (Nu)
            </label>
            <input
              value={spend}
              readOnly
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg disabled:opacity-90 disabled:cursor-not-allowed min-h-[60px]"
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            "Buy"
          )}
        </button>

        {message && (
          <p className="mt-4 text-base p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// BUY – step 2
function BuyBank({
  onBack,
  onNext,
  walletAddress,
}: {
  onBack: () => void;
  onNext: () => void;
  walletAddress: string;
}) {
  const banks = demoBanks();
  const [openDD, setOpenDD] = useState(false);
  const [bank, setBank] = useState(banks[1]);
  const [acct, setAcct] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              No coins
            </p>
          </div>

          <div className="mt-4 p-4 bg-white rounded-xl border border-black/5">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Wallet address:</span>
              <button
                onClick={copy}
                title="Copy"
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                type="button"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 break-all font-mono text-left">
              {formatWalletAddress(walletAddress)}
            </p>
            {copied && (
              <p className="mt-1 text-sm text-green-600">Copied to clipboard!</p>
            )}
          </div>

          <h3 className="mt-6 text-2xl font-bold">
            Enter Account Details
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Select Bank
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDD(!openDD)}
                className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base flex items-center justify-between hover:border-[#5B50D9] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <img src={bank.icon} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-base">{bank.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openDD ? 'rotate-180' : ''}`} />
              </button>
              {openDD && (
                <ul className="absolute z-10 mt-2 w-full rounded-2xl border border-black/10 bg-white shadow-lg max-h-64 overflow-y-auto">
                  {banks.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setBank(b);
                          setOpenDD(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={b.icon}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-base">{b.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-sm text-black/70">
              The coin will be transferred to{" "}
              <span className="font-semibold">{bank.name}</span>
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-black/60 mb-2">
              Account Number
            </label>
            <input
              placeholder="Account number"
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              className="w-full rounded-xl border border-[#9DB6D3] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
            />
          </div>
        </div>

        <button
          onClick={onNext}
          className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg"
        >
          Confirm
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// BUY – step 3
function BuyOtp({ onBack }: { onBack: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-6 pb-10">
      <div className="mx-auto max-w-[400px] w-full">
        <LogoBlob />
        <div className="text-center">
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-black/5">
            <p className="text-base text-black/70">
              <span className="font-semibold">Your wallet has</span>
              <br />
              No coins
            </p>
          </div>

          <h3 className="mt-6 text-2xl font-bold">Enter OTP</h3>
          <p className="mt-2 text-base text-black/60">
            Please enter the 6-digit OTP sent to your registered mobile number
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border border-[#9DB6D3] text-center text-xl sm:text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#5B50D9]/60 transition-all"
              inputMode="numeric"
              maxLength={1}
              type="text"
            />
          ))}
        </div>

        <button className="mt-4 text-base text-[#5B50D9] hover:text-[#4a46c4] transition-colors font-medium">
          Resend OTP
        </button>

        <button className="mt-6 w-full rounded-full bg-[#5B50D9] text-white py-4 font-semibold text-lg hover:bg-[#4a46c4] transition-colors shadow-lg">
          Confirm
        </button>

        <button
          onClick={onBack}
          className="mt-4 w-full text-center text-base text-black/60 hover:text-black/80 transition-colors py-2"
        >
          Back
        </button>
      </div>
    </div>
  );
}

/* =================================================================== */
/*                              SMALL BITS                              */
/* =================================================================== */

function LogoBlob() {
  return (
    <div className="mx-auto grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
      <Image 
        src="/coin.png" 
        alt="coin" 
        width={32} 
        height={32}
        className="w-6 h-6 sm:w-8 sm:h-8"
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}

function demoBanks() {
  return [
    { id: "bnb", name: "Bhutan National Bank", icon: "/RSEB.png" },
    { id: "bob", name: "Bank of Bhutan", icon: "/RSEB.png" },
    { id: "bdb", name: "Bhutan Development Bank", icon: "/RSEB.png" },
    { id: "dpnb", name: "Druk PNB", icon: "/RSEB.png" },
    { id: "tashi", name: "Tashi Bank", icon: "/RSEB.png" },
    { id: "kidu", name: "Digital Kidu", icon: "/RSEB.png" },
  ];
}

