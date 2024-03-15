import { FormEvent, MouseEventHandler, useState } from "react";
import logo from '../assets/logo.png';
import { DocumentService } from "../services/document-service";
import {ShareModal} from "./ShareModal";

export const DocumentCard = ({ name, content, onClick, id }: { id?: number, content: string | TrustedHTML, name?: string, onClick: MouseEventHandler<HTMLDivElement> }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const token = sessionStorage.getItem('token');

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (token) {
      DocumentService.delete(token, id).then(res => {
        alert(res.data.message);
      })
    }
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowShareModal(true);
    setShowDropdown(!showDropdown);
  };

  const closeModal = (e: FormEvent<Element>) => {
    e.stopPropagation();
    setShowShareModal(false);
    setShowDropdown(!showDropdown);
  };

  return (
    <div className=" w-1/5 mb-8 flex justify-center flex-col items-center cursor-pointer">
      <div onClick={onClick} className="w-3/4 h-64 bg-white shadow rounded flex flex-col justify-between relative">
        <div className="p-3 text-xs font-extralight text-justify" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="flex justify-between flex-col px-4">
          <p className="text-sm text-gray-800 mt-2">{name}</p>
          <div className="flex items-center">
            <img src={logo} alt="" className="w-4 py-2" />
            <div className="text-xs font-thin mx-3">Mar 14, 2024</div>
            <div className="relative ml-3">
              <button onClick={handleDropdownToggle} className="focus:outline-none ml-">
                <svg width="20px" height="20px" viewBox="0 0 24 24" id="three-dots" xmlns="http://www.w3.org/2000/svg">
                  <g id="_20x20_three-dots--grey" data-name="20x20/three-dots--grey" transform="translate(24) rotate(90)">
                    <rect id="Rectangle" width="24" height="24" fill="none" />
                    <circle id="Oval" cx="1" cy="1" r="1" transform="translate(5 11)" stroke="#000000" strokeMiterlimit="10" strokeWidth="0.5" />
                    <circle id="Oval-2" data-name="Oval" cx="1" cy="1" r="1" transform="translate(11 11)" stroke="#000000" strokeMiterlimit="10" strokeWidth="0.5" />
                    <circle id="Oval-3" data-name="Oval" cx="1" cy="1" r="1" transform="translate(17 11)" stroke="#000000" strokeMiterlimit="10" strokeWidth="0.5" />
                  </g>
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute left-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button onClick={handleDelete} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">Delete</button>
                    <button onClick={handleShare} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">Share</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showShareModal && <ShareModal id={id} closeModal={closeModal} />}
    </div>
  );
};
