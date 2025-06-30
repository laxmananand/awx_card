export const getTheme = (answers) => {

    const themes = [
        { "id": "1", "colorSet": ["green"], "isLight": true, "main": "#3b656b", "primary": "#0b8fb9", "secondary": "#299e58", "tertiary": "#f0b429", "primaryB": "rgba(11, 143, 185, 0.1)", "secondaryB": "rgba(41, 158, 88, 0.1)", "tertiaryB": "rgba(240, 180, 41, 0.1)", "color0": "#ffffff", "color25": "#e7ebef", "color50": "rgba(219, 229, 230, 0.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "350", "brand_L": "50%", "brand_S": "60%" },
        { "id": "2", "colorSet": ["blue"], "isLight": true, "main": "#5f6090", "primary": "#2d7150", "primaryB": "#2d715010", "secondary": "#8e925a", "secondaryB": "#8e925a10", "tertiary": "#d43838", "tertiaryB": "#d4383810", "color0": "#ffffff", "brand": "350", "brand_L": "40%", "brand_S": "50%" },
        { "id": "3", "colorSet": ["blue"], "isLight": true, "main": "#97b4c2", "primary": "#1289b6", "primaryB": "#1289b610", "secondary": "#509f5f", "secondaryB": "#509f5f10", "tertiary": "#edaa25", "tertiaryB": "#edaa2510", "color0": "#ffffff", "brand": "350", "brand_L": "60%", "brand_S": "70%" },
        { "id": "4", "colorSet": ["green"], "isLight": true, "main": "#6dc5c4", "primary": "#0066cc", "primaryB": "#0066cc10", "secondary": "#9e11da", "secondaryB": "#9e11da10", "tertiary": "#5ae5de", "tertiaryB": "#5ae5de10", "color0": "#ffffff", "brand": "350", "brand_L": "55%", "brand_S": "65%" },
        { "id": "5", "colorSet": ["blue"], "isLight": true, "main": "#1d1f7c", "primary": "#2d7150", "secondary": "#8e925a", "tertiary": "#d43838", "primaryB": "#2d715010", "secondaryB": "#8e925a10", "tertiaryB": "#d4383810", "color0": "#ffffff", "color25": "#e7ebef", "color50": "rgba(219, 229, 230, 0.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "350", "brand_L": "35%", "brand_S": "45%" },
        { "id": "9", "colorSet": ["brown"], "isLight": true, "main": "#55220c", "primary": "#22814b", "secondary": "#631f08", "tertiary": "#2630ba", "primaryB": "#22814b10", "secondaryB": "#631f0810", "tertiaryB": "#2630ba10", "color0": "#ffffff", "color25": "#f1f2ed", "color50": "#fff0f0", "color75": "#2d1c69", "color100": "#3f1308", "brand": "250", "brand_L": "40%", "brand_S": "50%" },
        { "id": "11", "colorSet": ["black"], "isLight": true, "main": "#000000", "primary": "#bc0b0b", "secondary": "#1a512d", "tertiary": "#2630ba", "primaryB": "#bc0b0b10", "secondaryB": "#1a512d10", "tertiaryB": "#2630ba10", "color0": "#ffffff", "color25": "#ffffff", "color50": "#f5f5f5", "color75": "#2d1c69", "color100": "#3f1308", "brand": "150", "brand_L": "20%", "brand_S": "30%" },
        { "id": "21", "colorSet": ["green"], "isLight": true, "main": "#8cd246", "primary": "#1d6a9a", "secondary": "#a5e4be", "tertiary": "#f0b429", "primaryB": "#1d6a9a10", "secondaryB": "#a5e4be10", "tertiaryB": "rgba(240,180,41,.1)", "color0": "#ffffff", "color25": "#1e258a", "color50": "#f1efef", "color75": "#8f9096", "color100": "#058a2d", "brand": "50", "brand_L": "70%", "brand_S": "80%" },
        { "id": "15", "colorSet": ["blue"], "isLight": true, "main": "#2f536f", "primary": "#455fb0", "secondary": "#b65d66", "tertiary": "#536b4c", "primaryB": "#455fb010", "secondaryB": "#b65d6610", "tertiaryB": "#536b4c10", "color0": "#ffffff", "color25": "#99bbcc", "color50": "rgba(219, 229, 230, 0.2)", "color75": "#8f9096", "color100": "#30253c", "brand": "200", "brand_L": "50%", "brand_S": "60%" },
        { "id": "13", "colorSet": ["blue"], "isLight": false, "main": "#52357e", "primary": "#791515", "secondary": "#1b793c", "tertiary": "#2630ba", "primaryB": "#79151510", "secondaryB": "#1b793c10", "tertiaryB": "#2630ba10", "color0": "#dfdbe6", "color25": "#ffffff", "color50": "#e5e0e0", "color75": "#2d1c69", "color100": "#3f1308", "brand": "90", "brand_L": "30%", "brand_S": "40%" },
        { "id": "14", "colorSet": ["blue"], "isLight": false, "main": "#2f536f", "primary": "#263d82", "secondary": "#b01121", "tertiary": "#304729", "primaryB": "#263d8210", "secondaryB": "#b0112110", "tertiaryB": "#30472910", "color0": "#c9d1d9", "color25": "#b71a1a", "color50": "rgba(219, 229, 230, 0.2)", "color75": "#8f9096", "color100": "#500c7d", "brand": "230", "brand_L": "40%", "brand_S": "50%" },
        { "id": "16", "colorSet": ["blue"], "isLight": false, "main": "#708ce1", "primary": "#0b8fb9", "secondary": "#8d6aec", "tertiary": "#f0b429", "primaryB": "rgba(11,143,185,.1)", "secondaryB": "#8d6aec10", "tertiaryB": "rgba(240,180,41,.1)", "color0": "#fafafa", "color25": "#f1f2f4", "color50": "rgba(219,229,230,.2)", "color75": "#8f9096", "color100": "#0010eb", "brand": "170", "brand_L": "60%", "brand_S": "70%" },
        { "id": "17", "colorSet": ["green"], "isLight": false, "main": "#8dca72", "primary": "#0b75b7", "secondary": "#a5e4be", "tertiary": "#f0b429", "primaryB": "#0b75b710", "secondaryB": "#a5e4be10", "tertiaryB": "rgba(240,180,41,.1)", "color0": "#fafafa", "color25": "#1e258a", "color50": "#f1efef", "color75": "#8f9096", "color100": "#058a2d", "brand": "80", "brand_L": "60%", "brand_S": "70%" },
        { "id": "18", "colorSet": ["blue"], "isLight": true, "main": "#9db3f4", "primary": "#204ab8", "secondary": "#4b4eae", "tertiary": "#4b4eae", "primaryB": "#204ab810", "secondaryB": "#4b4eae10", "tertiaryB": "#4b4eae10", "color0": "#fafafa", "color25": "#f1f2f4", "color50": "rgba(219,229,230,.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "210", "brand_L": "60%", "brand_S": "70%" },
        { "id": "19", "colorSet": ["blue"], "isLight": false, "main": "#1049d2", "primary": "#293d5d", "secondary": "#109f58", "tertiary": "#2630ba", "primaryB": "#293d5d10", "secondaryB": "#109f5810", "tertiaryB": "#2630ba10", "color0": "#fafafa", "color25": "#f1f2f4", "color50": "rgba(219,229,230,.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "240", "brand_L": "50%", "brand_S": "60%" },
        { "id": "20", "colorSet": ["blue"], "isLight": false, "main": "#2085d4", "primary": "#293d5d", "secondary": "#109f58", "tertiary": "#2630ba", "primaryB": "#293d5d10", "secondaryB": "#109f5810", "tertiaryB": "#2630ba10", "color0": "#fafafa", "color25": "#f1f2f4", "color50": "rgba(219,229,230,.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "200", "brand_L": "60%", "brand_S": "70%" },
        { "id": "22", "colorSet": ["blue"], "isLight": false, "main": "#1049d2", "primary": "#2630ba", "secondary": "#109f58", "tertiary": "#2630ba", "primaryB": "#2630ba10", "secondaryB": "#109f5810", "tertiaryB": "#2630ba10", "color0": "#fafafa", "color25": "#f1f2f4", "color50": "rgba(219,229,230,.2)", "color75": "#8f9096", "color100": "#0a1e2c", "brand": "230", "brand_L": "50%", "brand_S": "60%" }
    ]
    

    let filterThemes = themes.filter((item)=>(item?.isLight===answers?.isLight && (answers?.colors?.any || (answers?.colors?.green && (item?.colorSet.includes("green"))) || (answers?.colors?.black && (item?.colorSet.includes("black"))) || (answers?.colors?.blue && (item?.colorSet.includes("blue"))) || (answers?.colors?.brown && (item?.colorSet.includes("brown"))))));


    return filterThemes.concat(themes);

}












