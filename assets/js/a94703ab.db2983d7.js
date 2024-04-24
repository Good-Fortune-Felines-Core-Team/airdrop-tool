"use strict";(self.webpackChunk_jumpdefi_airdrop_tool=self.webpackChunk_jumpdefi_airdrop_tool||[]).push([[48],{2559:(e,t,n)=>{n.r(t),n.d(t,{default:()=>fe});var a=n(6540),i=n(4164),o=n(1003),r=n(7559),s=n(6153),l=n(6588),c=n(1312),d=n(3104),u=n(5062);const m={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"};var b=n(4848);function h(){var e=function(e){var t=e.threshold,n=(0,a.useState)(!1),i=n[0],o=n[1],r=(0,a.useRef)(!1),s=(0,d.gk)(),l=s.startScroll,c=s.cancelScroll;return(0,d.Mq)((function(e,n){var a=e.scrollY,i=null==n?void 0:n.scrollY;i&&(r.current?r.current=!1:a>=i?(c(),o(!1)):a<t?o(!1):a+window.innerHeight<document.documentElement.scrollHeight&&o(!0))})),(0,u.$)((function(e){e.location.hash&&(r.current=!0,o(!1))})),{shown:i,scrollToTop:function(){return l(0)}}}({threshold:300}),t=e.shown,n=e.scrollToTop;return(0,b.jsx)("button",{"aria-label":(0,c.T)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,i.A)("clean-btn",r.G.common.backToTopButton,m.backToTopButton,t&&m.backToTopButtonShow),type:"button",onClick:n})}var p=n(3109),x=n(6347),v=n(4581),f=n(6342),j=n(3465);function g(e){return(0,b.jsx)("svg",Object.assign({width:"20",height:"20","aria-hidden":"true"},e,{children:(0,b.jsxs)("g",{fill:"#7a7a7a",children:[(0,b.jsx)("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),(0,b.jsx)("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})]})}))}const _={collapseSidebarButton:"collapseSidebarButton_PEFL",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_kv0_"};function A(e){var t=e.onClick;return(0,b.jsx)("button",{type:"button",title:(0,c.T)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,c.T)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,i.A)("button button--secondary button--outline",_.collapseSidebarButton),onClick:t,children:(0,b.jsx)(g,{className:_.collapseSidebarButtonIcon})})}var k=n(5041),C=n(8587),S=n(3807),T=Symbol("EmptyContext"),I=a.createContext(T);function N(e){var t=e.children,n=(0,a.useState)(null),i=n[0],o=n[1],r=(0,a.useMemo)((function(){return{expandedItem:i,setExpandedItem:o}}),[i]);return(0,b.jsx)(I.Provider,{value:r,children:t})}var B=n(1422),y=n(9169),w=n(8774),L=n(2303),E=["item","onItemClick","activePath","level","index"];function M(e){var t=e.collapsed,n=e.categoryLabel,a=e.onClick;return(0,b.jsx)("button",{"aria-label":t?(0,c.T)({id:"theme.DocSidebarItem.expandCategoryAriaLabel",message:"Expand sidebar category '{label}'",description:"The ARIA label to expand the sidebar category"},{label:n}):(0,c.T)({id:"theme.DocSidebarItem.collapseCategoryAriaLabel",message:"Collapse sidebar category '{label}'",description:"The ARIA label to collapse the sidebar category"},{label:n}),"aria-expanded":!t,type:"button",className:"clean-btn menu__caret",onClick:a})}function H(e){var t=e.item,n=e.onItemClick,o=e.activePath,l=e.level,c=e.index,d=(0,C.A)(e,E),u=t.items,m=t.label,h=t.collapsible,p=t.className,x=t.href,v=(0,f.p)().docs.sidebar.autoCollapseCategories,j=function(e){var t=(0,L.A)();return(0,a.useMemo)((function(){return e.href&&!e.linkUnlisted?e.href:!t&&e.collapsible?(0,s.Nr)(e):void 0}),[e,t])}(t),g=(0,s.w8)(t,o),_=(0,y.ys)(x,o),A=(0,B.u)({initialState:function(){return!!h&&(!g&&t.collapsed)}}),k=A.collapsed,N=A.setCollapsed,H=function(){var e=(0,a.useContext)(I);if(e===T)throw new S.dV("DocSidebarItemsExpandedStateProvider");return e}(),G=H.expandedItem,P=H.setExpandedItem,W=function(e){void 0===e&&(e=!k),P(e?null:c),N(e)};return function(e){var t=e.isActive,n=e.collapsed,i=e.updateCollapsed,o=(0,S.ZC)(t);(0,a.useEffect)((function(){t&&!o&&n&&i(!1)}),[t,o,n,i])}({isActive:g,collapsed:k,updateCollapsed:W}),(0,a.useEffect)((function(){h&&null!=G&&G!==c&&v&&N(!0)}),[h,G,c,N,v]),(0,b.jsxs)("li",{className:(0,i.A)(r.G.docs.docSidebarItemCategory,r.G.docs.docSidebarItemCategoryLevel(l),"menu__list-item",{"menu__list-item--collapsed":k},p),children:[(0,b.jsxs)("div",{className:(0,i.A)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":_}),children:[(0,b.jsx)(w.A,Object.assign({className:(0,i.A)("menu__link",{"menu__link--sublist":h,"menu__link--sublist-caret":!x&&h,"menu__link--active":g}),onClick:h?function(e){null==n||n(t),x?W(!1):(e.preventDefault(),W())}:function(){null==n||n(t)},"aria-current":_?"page":void 0,role:h&&!x?"button":void 0,"aria-expanded":h&&!x?!k:void 0,href:h?null!=j?j:"#":j},d,{children:m})),x&&h&&(0,b.jsx)(M,{collapsed:k,categoryLabel:m,onClick:function(e){e.preventDefault(),W()}})]}),(0,b.jsx)(B.N,{lazy:!0,as:"ul",className:"menu__list",collapsed:k,children:(0,b.jsx)(z,{items:u,tabIndex:k?-1:0,onItemClick:n,activePath:o,level:l+1})})]})}var G=n(6654),P=n(3186);const W={menuExternalLink:"menuExternalLink_NmtK"};var R=["item","onItemClick","activePath","level","index"];function O(e){var t=e.item,n=e.onItemClick,a=e.activePath,o=e.level,l=(e.index,(0,C.A)(e,R)),c=t.href,d=t.label,u=t.className,m=t.autoAddBaseUrl,h=(0,s.w8)(t,a),p=(0,G.A)(c);return(0,b.jsx)("li",{className:(0,i.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(o),"menu__list-item",u),children:(0,b.jsxs)(w.A,Object.assign({className:(0,i.A)("menu__link",!p&&W.menuExternalLink,{"menu__link--active":h}),autoAddBaseUrl:m,"aria-current":h?"page":void 0,to:c},p&&{onClick:n?function(){return n(t)}:void 0},l,{children:[d,!p&&(0,b.jsx)(P.A,{})]}))},d)}const D={menuHtmlItem:"menuHtmlItem_M9Kj"};function F(e){var t=e.item,n=e.level,a=e.index,o=t.value,s=t.defaultStyle,l=t.className;return(0,b.jsx)("li",{className:(0,i.A)(r.G.docs.docSidebarItemLink,r.G.docs.docSidebarItemLinkLevel(n),s&&[D.menuHtmlItem,"menu__list-item"],l),dangerouslySetInnerHTML:{__html:o}},a)}var U=["item"];function V(e){var t=e.item,n=(0,C.A)(e,U);switch(t.type){case"category":return(0,b.jsx)(H,Object.assign({item:t},n));case"html":return(0,b.jsx)(F,Object.assign({item:t},n));default:return(0,b.jsx)(O,Object.assign({item:t},n))}}var Y=["items"];function K(e){var t=e.items,n=(0,C.A)(e,Y),a=(0,s.Y)(t,n.activePath);return(0,b.jsx)(N,{children:a.map((function(e,t){return(0,b.jsx)(V,Object.assign({item:e,index:t},n),t)}))})}const z=(0,a.memo)(K),q={menu:"menu_SIkG",menuWithAnnouncementBar:"menuWithAnnouncementBar_GW3s"};function J(e){var t=e.path,n=e.sidebar,o=e.className,s=function(){var e=(0,k.Mj)().isActive,t=(0,a.useState)(e),n=t[0],i=t[1];return(0,d.Mq)((function(t){var n=t.scrollY;e&&i(0===n)}),[e]),e&&n}();return(0,b.jsx)("nav",{"aria-label":(0,c.T)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,i.A)("menu thin-scrollbar",q.menu,s&&q.menuWithAnnouncementBar,o),children:(0,b.jsx)("ul",{className:(0,i.A)(r.G.docs.docSidebarMenu,"menu__list"),children:(0,b.jsx)(z,{items:n,activePath:t,level:1})})})}const Q="sidebar_njMd",X="sidebarWithHideableNavbar_wUlq",Z="sidebarHidden_VK0M",$="sidebarLogo_isFc";function ee(e){var t=e.path,n=e.sidebar,a=e.onCollapse,o=e.isHidden,r=(0,f.p)(),s=r.navbar.hideOnScroll,l=r.docs.sidebar.hideable;return(0,b.jsxs)("div",{className:(0,i.A)(Q,s&&X,o&&Z),children:[s&&(0,b.jsx)(j.A,{tabIndex:-1,className:$}),(0,b.jsx)(J,{path:t,sidebar:n}),l&&(0,b.jsx)(A,{onClick:a})]})}const te=a.memo(ee);var ne=n(5600),ae=n(2069),ie=function(e){var t=e.sidebar,n=e.path,a=(0,ae.M)();return(0,b.jsx)("ul",{className:(0,i.A)(r.G.docs.docSidebarMenu,"menu__list"),children:(0,b.jsx)(z,{items:t,activePath:n,onItemClick:function(e){"category"===e.type&&e.href&&a.toggle(),"link"===e.type&&a.toggle()},level:1})})};function oe(e){return(0,b.jsx)(ne.GX,{component:ie,props:e})}const re=a.memo(oe);function se(e){var t=(0,v.l)(),n="desktop"===t||"ssr"===t,a="mobile"===t;return(0,b.jsxs)(b.Fragment,{children:[n&&(0,b.jsx)(te,Object.assign({},e)),a&&(0,b.jsx)(re,Object.assign({},e))]})}const le={expandButton:"expandButton_TmdG",expandButtonIcon:"expandButtonIcon_i1dp"};function ce(e){var t=e.toggleSidebar;return(0,b.jsx)("div",{className:le.expandButton,title:(0,c.T)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,c.T)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t,children:(0,b.jsx)(g,{className:le.expandButtonIcon})})}const de={docSidebarContainer:"docSidebarContainer_YfHR",docSidebarContainerHidden:"docSidebarContainerHidden_DPk8",sidebarViewport:"sidebarViewport_aRkj"};function ue(e){var t,n=e.children,i=(0,l.t)();return(0,b.jsx)(a.Fragment,{children:n},null!=(t=null==i?void 0:i.name)?t:"noSidebar")}function me(e){var t=e.sidebar,n=e.hiddenSidebarContainer,o=e.setHiddenSidebarContainer,s=(0,x.zy)().pathname,l=(0,a.useState)(!1),c=l[0],d=l[1],u=(0,a.useCallback)((function(){c&&d(!1),!c&&(0,p.O)()&&d(!0),o((function(e){return!e}))}),[o,c]);return(0,b.jsx)("aside",{className:(0,i.A)(r.G.docs.docSidebarContainer,de.docSidebarContainer,n&&de.docSidebarContainerHidden),onTransitionEnd:function(e){e.currentTarget.classList.contains(de.docSidebarContainer)&&n&&d(!0)},children:(0,b.jsx)(ue,{children:(0,b.jsxs)("div",{className:(0,i.A)(de.sidebarViewport,c&&de.sidebarViewportHidden),children:[(0,b.jsx)(se,{sidebar:t,path:s,onCollapse:u,isHidden:c}),c&&(0,b.jsx)(ce,{toggleSidebar:u})]})})})}const be={docMainContainer:"docMainContainer_TBSr",docMainContainerEnhanced:"docMainContainerEnhanced_lQrH",docItemWrapperEnhanced:"docItemWrapperEnhanced_JWYK"};function he(e){var t=e.hiddenSidebarContainer,n=e.children,a=(0,l.t)();return(0,b.jsx)("main",{className:(0,i.A)(be.docMainContainer,(t||!a)&&be.docMainContainerEnhanced),children:(0,b.jsx)("div",{className:(0,i.A)("container padding-top--md padding-bottom--lg",be.docItemWrapper,t&&be.docItemWrapperEnhanced),children:n})})}const pe={docRoot:"docRoot_UBD9",docsWrapper:"docsWrapper_hBAB"};function xe(e){var t=e.children,n=(0,l.t)(),i=(0,a.useState)(!1),o=i[0],r=i[1];return(0,b.jsxs)("div",{className:pe.docsWrapper,children:[(0,b.jsx)(h,{}),(0,b.jsxs)("div",{className:pe.docRoot,children:[n&&(0,b.jsx)(me,{sidebar:n.items,hiddenSidebarContainer:o,setHiddenSidebarContainer:r}),(0,b.jsx)(he,{hiddenSidebarContainer:o,children:t})]})]})}var ve=n(3363);function fe(e){var t=(0,s.B5)(e);if(!t)return(0,b.jsx)(ve.A,{});var n=t.docElement,a=t.sidebarName,c=t.sidebarItems;return(0,b.jsx)(o.e3,{className:(0,i.A)(r.G.page.docsDocPage),children:(0,b.jsx)(l.V,{name:a,items:c,children:(0,b.jsx)(xe,{children:n})})})}},3363:(e,t,n)=>{n.d(t,{A:()=>s});n(6540);var a=n(4164),i=n(1312),o=n(1107),r=n(4848);function s(e){var t=e.className;return(0,r.jsx)("main",{className:(0,a.A)("container margin-vert--xl",t),children:(0,r.jsx)("div",{className:"row",children:(0,r.jsxs)("div",{className:"col col--6 col--offset-3",children:[(0,r.jsx)(o.A,{as:"h1",className:"hero__title",children:(0,r.jsx)(i.A,{id:"theme.NotFound.title",description:"The title of the 404 page",children:"Page Not Found"})}),(0,r.jsx)("p",{children:(0,r.jsx)(i.A,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page",children:"We could not find what you were looking for."})}),(0,r.jsx)("p",{children:(0,r.jsx)(i.A,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page",children:"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."})})]})})})}}}]);