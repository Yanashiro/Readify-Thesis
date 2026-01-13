Comments {

Patrick: Can we use vite 6 for rendering the ReactJS (JSX) files? Im using vite 6 as my dev environment. Its also compatible with Node.JS 18 and only needs a bundle.js using Rollup, to effectively render in all EJS files

Patrick: Wait, should I use .js instead of .jsx so it can load with .ejs?

}

JSX updates {

aboutus.jsx: needs change in content

achievements.jsx: needs revision on the useEffect() fetch -> axios data, handleUnlock must set setUnlocked to update useState achievement tabs

dashboard.jsx: still needs revisions after the removal of the vocabulary test tab

maintest.jsx: in function 'active' set return setItemAnswered to 'isCompleted'

root.jsx: Note: root.jsx is still on the development phase to determine how it will respond to EJS rendering

navbar.jsx: Links still don't work if the JSX is used as a component, needs revision here

}

CSS updates {

achievements.css: needs to add import fonts

}
