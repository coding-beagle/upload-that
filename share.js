const _0x396b52=_0x5683;(function(_0x1d9115,_0x4c3468){const _0x391b2a=_0x5683,_0x1aa68b=_0x1d9115();while(!![]){try{const _0x368ff9=parseInt(_0x391b2a(0x1bd))/0x1+-parseInt(_0x391b2a(0x1ce))/0x2*(parseInt(_0x391b2a(0x1bb))/0x3)+parseInt(_0x391b2a(0x1e1))/0x4*(-parseInt(_0x391b2a(0x18a))/0x5)+-parseInt(_0x391b2a(0x187))/0x6+-parseInt(_0x391b2a(0x1ac))/0x7+-parseInt(_0x391b2a(0x191))/0x8*(-parseInt(_0x391b2a(0x1a3))/0x9)+parseInt(_0x391b2a(0x1e3))/0xa;if(_0x368ff9===_0x4c3468)break;else _0x1aa68b['push'](_0x1aa68b['shift']());}catch(_0x79de3d){_0x1aa68b['push'](_0x1aa68b['shift']());}}}(_0x5932,0x89d52));const API_BASE_URL=_0x396b52(0x20c),urlParams=new URLSearchParams(window['location']['search']),randomBase64=urlParams[_0x396b52(0x1ed)]('id'),socket=io(API_BASE_URL),link=window[_0x396b52(0x1d6)][_0x396b52(0x1f7)]+_0x396b52(0x1a8)+randomBase64;function _0x5683(_0x265575,_0x301bb1){const _0x593249=_0x5932();return _0x5683=function(_0x568391,_0x30b596){_0x568391=_0x568391-0x174;let _0x597122=_0x593249[_0x568391];return _0x597122;},_0x5683(_0x265575,_0x301bb1);}socket['on'](_0x396b52(0x1be),async()=>{const _0x5e6312=_0x396b52;socket[_0x5e6312(0x183)]('joinRoom',randomBase64);const _0xad6f0a=await fetchFiles(randomBase64);_0xad6f0a[_0x5e6312(0x1a7)](_0x51384b=>{const _0x219d6b=_0x5e6312;displayFile(_0x51384b['file_name'],_0x51384b[_0x219d6b(0x1cf)],_0x51384b[_0x219d6b(0x1e4)],_0x51384b['id']);});}),socket['on'](_0x396b52(0x19c),async()=>{const _0x3104e2=_0x396b52,_0x2eadf1=await fetchFiles(randomBase64);_0x2eadf1[_0x3104e2(0x1a7)](_0x10f81e=>{const _0x2514e0=_0x3104e2;displayFile(_0x10f81e[_0x2514e0(0x1a2)],_0x10f81e[_0x2514e0(0x1cf)],_0x10f81e[_0x2514e0(0x1e4)],_0x10f81e['id']);});}),socket['on'](_0x396b52(0x1ec),()=>{const _0xe0e97a=_0x396b52;createPopup('A\x20device\x20has\x20joined\x20the\x20session','lightgreen'),$(document)[_0xe0e97a(0x1b5)](function(){const _0x24ed79=_0xe0e97a;$(_0x24ed79(0x18e))['modal'](_0x24ed79(0x1a5));});}),socket['on'](_0x396b52(0x1b8),()=>{const _0x25cc0c=_0x396b52;createPopup(_0x25cc0c(0x1d9),_0x25cc0c(0x1c7));}),socket['on'](_0x396b52(0x18d),async _0x40c6ce=>{const _0x1888f8=_0x396b52,_0x193ceb=document[_0x1888f8(0x178)](_0x1888f8(0x1b0)+_0x40c6ce+'\x22]');_0x193ceb&&_0x193ceb[_0x1888f8(0x17b)]();}),socket['on'](_0x396b52(0x1b2),()=>{const _0x4312ba=_0x396b52;document['getElementById']('loader-container')[_0x4312ba(0x1de)][_0x4312ba(0x188)]='flex';}),socket['on'](_0x396b52(0x201),()=>{const _0x2465e2=_0x396b52;document[_0x2465e2(0x1a0)](_0x2465e2(0x1db))[_0x2465e2(0x1de)][_0x2465e2(0x188)]=_0x2465e2(0x19e);});const qrCodeElement=document['getElementById'](_0x396b52(0x1c8)),qrCodeModalElement=document[_0x396b52(0x1a0)](_0x396b52(0x209)),qrCodeLink=document[_0x396b52(0x1a0)](_0x396b52(0x174));qrCodeElement[_0x396b52(0x1de)][_0x396b52(0x188)]='none',new QRCode(qrCodeModalElement,link),qrCodeLink['value']=link,document[_0x396b52(0x1a0)](_0x396b52(0x17d))[_0x396b52(0x1c2)](_0x396b52(0x212),()=>{const _0x2becf5=_0x396b52,_0x790ae5=document[_0x2becf5(0x1a0)](_0x2becf5(0x174));_0x790ae5[_0x2becf5(0x205)](),document[_0x2becf5(0x192)](_0x2becf5(0x1d7)),alert(_0x2becf5(0x198));});function createQRCode(){const _0x504823=_0x396b52,_0x17439d=window[_0x504823(0x1d6)]['origin']+_0x504823(0x1af)+randomBase64,_0x3b6034=document[_0x504823(0x1a0)](_0x504823(0x1c8));new QRCode(_0x3b6034,_0x17439d);}async function fetchFiles(_0x20a535){const _0x13c686=_0x396b52;try{const _0x4e0757=await fetch(API_BASE_URL+'/files/'+_0x20a535);if(!_0x4e0757['ok'])throw new Error(_0x13c686(0x193));const _0x50156f=await _0x4e0757[_0x13c686(0x20f)]();return _0x50156f;}catch(_0x1e5163){console[_0x13c686(0x1a4)](_0x1e5163);throw _0x1e5163;}}document[_0x396b52(0x1a0)](_0x396b52(0x1d4))[_0x396b52(0x1c2)](_0x396b52(0x1c4),async _0x24b830=>{const _0x592c9c=_0x396b52,_0x21faf1=_0x24b830['target'][_0x592c9c(0x1ee)],_0xb20673=0x19*0x400*0x400,_0x17748f=_0x21faf1[0x0];document[_0x592c9c(0x1a0)](_0x592c9c(0x1db))['style'][_0x592c9c(0x188)]=_0x592c9c(0x1ef);if(_0x21faf1[_0x592c9c(0x1d1)]>0x0){if(_0x17748f[_0x592c9c(0x208)]>_0xb20673){const _0x4116e0=_0x592c9c(0x17f),_0x4ee5cf=document[_0x592c9c(0x1a0)](_0x592c9c(0x1f2));_0x4ee5cf&&_0x4ee5cf[_0x592c9c(0x17b)]();const _0x3e1c1b=document['createElement']('div');_0x3e1c1b['id']='errorPopup',_0x3e1c1b[_0x592c9c(0x199)]=_0x4116e0,_0x3e1c1b['style'][_0x592c9c(0x1a6)]=_0x592c9c(0x184),_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x20b)]='50%',_0x3e1c1b['style']['left']=_0x592c9c(0x18b),_0x3e1c1b[_0x592c9c(0x1de)]['transform']=_0x592c9c(0x1bf),_0x3e1c1b[_0x592c9c(0x1de)]['backgroundColor']=_0x592c9c(0x1c7),_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x19b)]=_0x592c9c(0x181),_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x186)]=_0x592c9c(0x190),_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x17a)]='10px',_0x3e1c1b[_0x592c9c(0x1de)]['animation']=_0x592c9c(0x1dc),_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x1e9)]='1',_0x3e1c1b[_0x592c9c(0x1de)][_0x592c9c(0x1c9)]=_0x592c9c(0x177),document[_0x592c9c(0x1fc)]['appendChild'](_0x3e1c1b),setTimeout(()=>{_0x3e1c1b['remove']();},0x1388);return;}socket[_0x592c9c(0x183)]('fileUploading');const _0x218074=await uploadFile(_0x17748f);displayFile(_0x17748f[_0x592c9c(0x1b1)],_0x17748f['size'],_0x17748f[_0x592c9c(0x195)],_0x218074),document[_0x592c9c(0x1a0)](_0x592c9c(0x1db))[_0x592c9c(0x1de)][_0x592c9c(0x188)]='none',socket[_0x592c9c(0x183)](_0x592c9c(0x1e8),randomBase64);}}),window['addEventListener'](_0x396b52(0x17c),()=>{socket['emit']('leaveRoom',randomBase64);});async function uploadFile(_0x5cb1c1){const _0x409981=_0x396b52,_0x11913e=new FormData();_0x11913e[_0x409981(0x1d5)](_0x409981(0x1e2),_0x5cb1c1),_0x11913e[_0x409981(0x1d5)](_0x409981(0x20a),''+randomBase64);const _0xdeb949=await fetch(API_BASE_URL+_0x409981(0x197),{'method':_0x409981(0x1a1),'body':_0x11913e});if(!_0xdeb949['ok'])throw new Error(_0x409981(0x1f3));const _0x1b7c02=await _0xdeb949[_0x409981(0x206)](),_0x4096b5=JSON['parse'](_0x1b7c02);return _0x4096b5[_0x409981(0x1ab)];}function displayFile(_0x26f22a,_0x43d67f,_0x442c3c,_0x5698aa){const _0x5756dc=_0x396b52,_0x38b6f9=document[_0x5756dc(0x1c1)](_0x5756dc(0x19a));for(let _0x1a2428=0x0;_0x1a2428<_0x38b6f9['length'];_0x1a2428++){const _0x3fd052=_0x38b6f9[_0x1a2428][_0x5756dc(0x178)](_0x5756dc(0x1e6))[_0x5756dc(0x199)],_0x10c233=Number(_0x38b6f9[_0x1a2428][_0x5756dc(0x214)](_0x5756dc(0x180)));if(_0x3fd052===_0x26f22a&&_0x10c233===_0x43d67f)return;}const _0x4ed770=document[_0x5756dc(0x178)]('.file-item[data-file-id=\x22'+_0x5698aa+'\x22]');if(_0x4ed770){console[_0x5756dc(0x213)](_0x5756dc(0x1f1)+_0x5698aa+'\x20already\x20exists\x20in\x20the\x20list.');return;}const _0x585e56=document[_0x5756dc(0x1e0)]('div');_0x585e56[_0x5756dc(0x175)]=_0x5756dc(0x1d8),_0x585e56[_0x5756dc(0x1f9)](_0x5756dc(0x1c6),_0x5698aa),_0x585e56[_0x5756dc(0x1f9)](_0x5756dc(0x180),_0x43d67f);const _0x3d8ccd=document[_0x5756dc(0x1e0)]('p');_0x3d8ccd[_0x5756dc(0x175)]='file-name';let _0x612015=0xd,_0x51abfd=_0x26f22a,_0x3072df=_0x51abfd[_0x5756dc(0x1eb)]('.')[_0x5756dc(0x19d)]();_0x51abfd[_0x5756dc(0x1d1)]>_0x612015+_0x3072df['length']+0x1&&(_0x51abfd=_0x51abfd[_0x5756dc(0x196)](0x0,_0x612015)+_0x5756dc(0x189)+_0x3072df);_0x3d8ccd[_0x5756dc(0x199)]=_0x51abfd;const _0xfdd912=document[_0x5756dc(0x1e0)]('div');_0xfdd912['className']=_0x5756dc(0x19f),_0xfdd912['appendChild'](_0x3d8ccd);const _0x3a85d5=document[_0x5756dc(0x1e0)](_0x5756dc(0x1d2));_0x3a85d5[_0x5756dc(0x175)]='btn\x20btn-primary\x20btn-sm\x20ml-2',_0x3a85d5['innerHTML']=_0x5756dc(0x1cb),_0x3a85d5[_0x5756dc(0x1de)][_0x5756dc(0x188)]='flex',_0x3a85d5[_0x5756dc(0x1de)][_0x5756dc(0x1f8)]=_0x5756dc(0x1c0),_0x3a85d5[_0x5756dc(0x1de)]['alignItems']=_0x5756dc(0x1c0),_0x3a85d5[_0x5756dc(0x1c2)]('click',()=>{const _0xb242f7=_0x5756dc;window[_0xb242f7(0x1d6)][_0xb242f7(0x20e)]=API_BASE_URL+_0xb242f7(0x179)+_0x5698aa;});const _0x211f35=document[_0x5756dc(0x1e0)]('button');_0x211f35[_0x5756dc(0x175)]='btn\x20btn-danger\x20btn-sm\x20ml-2',_0x211f35[_0x5756dc(0x1f6)]=_0x5756dc(0x1bc),_0x211f35['style'][_0x5756dc(0x188)]='flex',_0x211f35[_0x5756dc(0x1de)]['justifyContent']=_0x5756dc(0x1c0),_0x211f35[_0x5756dc(0x1de)][_0x5756dc(0x182)]='center',_0x211f35[_0x5756dc(0x1c2)]('click',async()=>{const _0x141fb1=_0x5756dc;try{await deleteFile(_0x5698aa),socket[_0x141fb1(0x183)](_0x141fb1(0x1cd),randomBase64,_0x5698aa),_0x585e56['remove']();}catch(_0x4140ca){console[_0x141fb1(0x1a4)](_0x141fb1(0x185),_0x4140ca);}});const _0x332ff2=document[_0x5756dc(0x1e0)]('div');_0x332ff2['className']='buttons',_0x332ff2['appendChild'](_0x3a85d5),_0x332ff2[_0x5756dc(0x1b9)](_0x211f35),_0x585e56[_0x5756dc(0x1b9)](_0xfdd912),_0x585e56['appendChild'](_0x332ff2),document[_0x5756dc(0x178)](_0x5756dc(0x1fa))[_0x5756dc(0x1b9)](_0x585e56),createImagePreview(_0x5698aa,_0x442c3c,_0x585e56),_0x585e56[_0x5756dc(0x1de)][_0x5756dc(0x1f4)]='grow\x201s\x20cubic-bezier(0.68,\x20-0.55,\x200.265,\x201.55)';}async function createImagePreview(_0x3256fc,_0x714e28,_0x15de92){const _0x37c552=_0x396b52,_0x544cf9=API_BASE_URL+_0x37c552(0x179)+_0x3256fc;if(_0x714e28[_0x37c552(0x1ad)](_0x37c552(0x1da))){const _0xaac909=new Image();_0xaac909['src']=_0x544cf9,_0xaac909[_0x37c552(0x175)]=_0x37c552(0x176),_0x15de92[_0x37c552(0x178)]('.file-content')[_0x37c552(0x1b9)](_0xaac909);}else{const _0x4f5d73=getFileTypeIcon(_0x714e28),_0x40425e=document['createElement'](_0x37c552(0x204));_0x40425e['src']=_0x4f5d73,_0x40425e[_0x37c552(0x1df)]=_0x714e28+_0x37c552(0x210),_0x40425e['className']=_0x37c552(0x1d3),_0x15de92[_0x37c552(0x178)]('.file-content')[_0x37c552(0x1b9)](_0x40425e);}}async function deleteFile(_0x2ccae8){const _0x4bf8eb=_0x396b52;try{const _0x33778f=await fetch(API_BASE_URL+'/delete/'+_0x2ccae8,{'method':_0x4bf8eb(0x194)});if(!_0x33778f['ok'])throw new Error(_0x4bf8eb(0x1ca));}catch(_0x5ba38e){console['error'](_0x4bf8eb(0x185),_0x5ba38e);throw _0x5ba38e;}}function createPopup(_0x515b0b,_0x36fa2b){const _0x1edcd9=_0x396b52,_0x39467e=document[_0x1edcd9(0x1e0)](_0x1edcd9(0x1aa));_0x39467e[_0x1edcd9(0x175)]=_0x1edcd9(0x18c),_0x39467e['style'][_0x1edcd9(0x1a6)]='fixed',_0x39467e[_0x1edcd9(0x1de)][_0x1edcd9(0x207)]=_0x1edcd9(0x190),_0x39467e[_0x1edcd9(0x1de)][_0x1edcd9(0x1c3)]='20px',_0x39467e[_0x1edcd9(0x1de)][_0x1edcd9(0x186)]=_0x1edcd9(0x202),_0x39467e['style']['backgroundColor']=_0x36fa2b,_0x39467e[_0x1edcd9(0x1de)]['color']=_0x1edcd9(0x1ff),_0x39467e[_0x1edcd9(0x1de)][_0x1edcd9(0x17a)]='5px',_0x39467e[_0x1edcd9(0x1de)][_0x1edcd9(0x18f)]='1',_0x39467e['style'][_0x1edcd9(0x1f5)]=_0x1edcd9(0x1fe),_0x39467e['textContent']=_0x515b0b,document[_0x1edcd9(0x1fc)]['appendChild'](_0x39467e),setTimeout(()=>{const _0x14e9d3=_0x1edcd9;_0x39467e[_0x14e9d3(0x1de)]['opacity']='0',setTimeout(()=>{const _0x412675=_0x14e9d3;document[_0x412675(0x1fc)][_0x412675(0x1d0)](_0x39467e);},0x2710);},0x64);}document['getElementById']('new-session-button')['addEventListener'](_0x396b52(0x212),()=>{const _0x3bd782=_0x396b52,_0x9f5844=generateRandomBase64(0x10);window[_0x3bd782(0x1d6)][_0x3bd782(0x20e)]=_0x3bd782(0x1e5)+_0x9f5844;});function getFileTypeIcon(_0x1f8b8b){const _0x2e28df=_0x396b52;switch(_0x1f8b8b){case _0x2e28df(0x1ae):return _0x2e28df(0x1dd);case _0x2e28df(0x203):case _0x2e28df(0x1f0):return _0x2e28df(0x1ba);case _0x2e28df(0x20d):case _0x2e28df(0x1b7):return _0x2e28df(0x1b6);case _0x2e28df(0x1e7):case'application/vnd.openxmlformats-officedocument.presentationml.presentation':return _0x2e28df(0x1b4);case _0x2e28df(0x1a9):return _0x2e28df(0x17e);default:return _0x2e28df(0x200);}}function _0x5932(){const _0x31e9f3=['appendChild','word.svg','84mvfwcY','<i\x20class=\x22fas\x20fa-times\x22></i>','937357ONpOoS','connect','translate(-50%,\x20-50%)','center','querySelectorAll','addEventListener','left','change','show','data-file-id','lightcoral','qr-code','zIndex','Failed\x20to\x20delete\x20file','<i\x20class=\x22fas\x20fa-download\x22></i>','charAt','fileDeleted','69668Tijesf','file_size','removeChild','length','button','file-icon','file-input','append','location','copy','file-item','A\x20device\x20has\x20left\x20the\x20session','image/','loader-container','fadeInShake\x201s\x20ease\x20both','pdf.svg','style','alt','createElement','4dTbJcJ','file','21366170XRVXUv','file_type','https://upload-that.com/share.html?id=','.file-name','application/vnd.ms-powerpoint','fileUploaded','animationIterationCount','ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_','split','userJoined','get','files','flex','application/vnd.openxmlformats-officedocument.wordprocessingml.document','File\x20with\x20ID\x20','errorPopup','An\x20error\x20occurred\x20while\x20uploading\x20the\x20file','animation','transition','innerHTML','origin','justifyContent','setAttribute','.file-list','test','body','modal','opacity\x205s','white','default.svg','hideLoadingElement','10px','application/msword','img','select','text','bottom','size','qr-code-modal','qr_code_id','top','https://uploadthat-service.onrender.com','application/vnd.ms-excel','href','json','\x20icon','floor','click','log','getAttribute','qr-code-link','className','file-thumbnail','1000','querySelector','/download/','borderRadius','remove','beforeunload','copy-link-btn','text.svg','File\x20size\x20is\x20too\x20large.\x20Please\x20upload\x20a\x20file\x20smaller\x20than\x2025\x20MB.','data-file-size','black','alignItems','emit','fixed','Error\x20deleting\x20file:','padding','3679890CLjlzl','display','...','5250815cykowj','50%','popup','fileDeletion','#qrCodeModal','opacity','20px','248kxDmQt','execCommand','An\x20error\x20occurred\x20while\x20fetching\x20the\x20files','DELETE','type','substring','/upload','Link\x20copied\x20to\x20clipboard!','textContent','.file-item','color','fetchFiles','pop','none','file-content','getElementById','POST','file_name','227646fZXRSR','error','hide','position','forEach','/share.html?id=','text/plain','div','file_id','4582872ePMtGc','startsWith','application/pdf','/join?id=','.file-item[data-file-id=\x22','name','showLoadingElement','userAgent','powerpoint.svg','ready','excel.svg','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','userLeft'];_0x5932=function(){return _0x31e9f3;};return _0x5932();}function generateRandomBase64(_0xc78a49){const _0x5d0abd=_0x396b52,_0x3f9455=_0x5d0abd(0x1ea);let _0x26b241='';for(let _0x1e1cbf=0x0;_0x1e1cbf<_0xc78a49;_0x1e1cbf++){_0x26b241+=_0x3f9455[_0x5d0abd(0x1cc)](Math[_0x5d0abd(0x211)](Math['random']()*_0x3f9455[_0x5d0abd(0x1d1)]));}return _0x26b241;}function isMobile(){const _0x4c7bf0=_0x396b52;return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i[_0x4c7bf0(0x1fb)](navigator[_0x4c7bf0(0x1b3)]);}createQRCode();!isMobile()&&$(document)[_0x396b52(0x1b5)](function(){const _0x469274=_0x396b52;$(_0x469274(0x18e))[_0x469274(0x1fd)](_0x469274(0x1c5));});document['getElementById'](_0x396b52(0x1db))[_0x396b52(0x1de)][_0x396b52(0x188)]=_0x396b52(0x19e);