var objectID = 0;




const oscMap = {
  '@sin': "sinewave",
  "@saw": "saw",
  "@square": "square",
  "@tri": "triangle",
  "@pha": "phasor"
};

const jsFuncMap = {
  'saw': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.saw(${p[0].loop})`},
  'sin': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.sinewave(${p[0].loop})`},
  'tri': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.triangle(${p[0].loop})`},
  'pha': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.phasor(${p[0].loop})`},
  'ph2': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.phasor(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'sqr': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.square(${p[0].loop})`},
  'pul': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.pulse(${p[0].loop},${p[1].loop})`},
  'noiz': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.noise()*${p[0].loop}`},
  'sawn': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.sawn(${p[0].loop})`},
  'gt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} > ${p[1].loop}) ? 1 : 0`},
  'lt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} < ${p[1].loop}) ? 1 : 0`},
  'mod': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} % ${p[1].loop})`},
  'add': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} + ${p[1].loop})`},
  'mul': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} * ${p[1].loop})`},
  'sub': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} - ${p[1].loop})`},
  'div': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} / ${p[1].loop})`},
  'pow': {"setup":(o,p)=>"", "loop":(o,p)=>`Math.pow(${p[0].loop},${p[1].loop})`},
  'abs': {"setup":(o,p)=>"", "loop":(o,p)=>`Math.abs(${p[0].loop})`},
  'env': {"setup":(o,p)=>`${o} = new Module.maxiEnv();${o}.setAttack(${p[1].loop});${o}.setDecay(${p[2].loop});${o}.setSustain(${p[3].loop});${o}.setRelease(${p[4].loop})`, "loop":(o,p)=>`${o}.adsr(1,${p[0].loop})`},
  'sum': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+")";}},
  'mix': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`((${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+`)/${p.length})`;}},
  'prod': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `*${p[i].loop}`; return s+")";}},
  'blin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
  'ulin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, 0, 1, ${p[1].loop}, ${p[2].loop})`},
  'bexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
  'uexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, 0.0000001, 1, ${p[1].loop}, ${p[2].loop})`},
  'linlin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`},
  'linexp': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, ${p[1].loop}, ${p[2].loop}),${p[3].loop}, ${p[4].loop})`},
  'dist': {"setup":(o,p)=>`${o} = new Module.maxiDistortion()`, "loop":(o,p)=>`${o}.atanDist(${p[0].loop},${p[1].loop})`},
  'flange': {"setup":(o,p)=>`${o} = new Module.maxiFlanger()`, "loop":(o,p)=>`${o}.flange(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
  'chor': {"setup":(o,p)=>`${o} = new Module.maxiChorus()`, "loop":(o,p)=>`${o}.chorus(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
  'dl': {"setup":(o,p)=>`${o} = new Module.maxiDelayline()`, "loop":(o,p)=>`${o}.dl(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'lpf': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lopass(${p[0].loop},${p[1].loop})`},
  'hpf': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hipass(${p[0].loop},${p[1].loop})`},
  'lpz': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lores(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'hpz': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hires(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'toModel': {"setup":(o,p)=>`${o} = this.registerTransducer('testmodel', ${p[0].loop})`, "loop":(o,p)=>`${o}.send(${p[1].loop}, ${p[2].loop})`},
  'fromModel': {"setup":(o,p)=>`${o} = this.registerTransducer('testmodel', ${p[0].loop})`, "loop":(o,p)=>`${o}.receive(${p[1].loop})`},
  'adc': {"setup":(o,p)=>"", "loop":(o,p)=>`inputs[${p[0].loop}]`},
  'sampler': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                                  ${o}.setSample(this.getSampleBuffer(${p[0].loop}));`,
                                  "loop":(o,p)=>`(${o}.isReady() ? ${o}.playOnZX(${p[1].loop}) : 0.0)`},
  'oscin':{"setup":(o,p)=>"", "loop":(o,p)=>`this.OSCTransducer(${p[0].loop},${p[1].loop})`},
}

class IRToJavascript {

  static getNextID() {
    objectID = objectID > 9999 ? 0 : ++objectID;
    return objectID;
  }

  static emptyCode() {
    return {
      "setup": "",
      "loop": "",
      "paramMarkers": []
    };
  }

  static traverseTree(t, code, level) {
    console.log(`DEBUG:IR:traverseTree: level: ${level}`);
    let attribMap = {
      '@lang': (ccode, el) => {
        // console.log("lang")
        // console.log(el);
        // console.log(ccode)
        el.map((langEl) => {
          ccode = IRToJavascript.traverseTree(langEl, ccode, level);
        });
        return ccode;
      },
      '@spawn': (ccode, el) => {
        // el.map((spawnEl) => {
        //
        //   ccode = IRToJavascript.traverseTree(spawnEl, ccode, level);
        //
        // });

        return IRToJavascript.traverseTree(el, ccode, level);
        // return ccode;
      },
      '@synth': (ccode, el) => {
        // console.log(el);
        // console.log(el['@jsfunc']);
        let paramMarkers = [{"s":el['paramBegin'], "e":el['paramEnd'], "l":level}]
        ccode.paramMarkers = ccode.paramMarkers.concat(paramMarkers);

        let functionName = el['@jsfunc'].value;
        let funcInfo = jsFuncMap[functionName];
        // console.log(funcInfo);
        let objName = "q.u" + IRToJavascript.getNextID();

        // console.log(el['@params']);
        // console.log(el['@params'].length);

        let allParams=[];

        for (let p = 0; p < el['@params'].length; p++) {
          let params = IRToJavascript.emptyCode();
          params = IRToJavascript.traverseTree(el['@params'][p], params, level+1);
          // console.log(params);
          allParams[p] = params;
        }
        console.log(allParams);
        let setupCode = "";
        for (let param in allParams) {
          setupCode += allParams[param].setup;
          ccode.paramMarkers = ccode.paramMarkers.concat(allParams[param].paramMarkers);
        }
        ccode.setup += `${setupCode} ${funcInfo.setup(objName, allParams)};`;
        ccode.loop += `${funcInfo.loop(objName, allParams)}`;
        return ccode;
      },
      '@setvar': (ccode, el) => {
        let varValueCode = IRToJavascript.traverseTree(el['@varvalue'], IRToJavascript.emptyCode(), level+1);
        ccode.setup += varValueCode.setup;
        ccode.loop = `this.setvar(q, '${el['@varname']}', ${varValueCode.loop})`;
        return ccode;
      },
      '@string': (ccode, el) => {
        // console.log(el);
        if (typeof el === 'string' || el instanceof String) {
          console.log("String: " + el);
          ccode.loop += `'${el}'`;
        } else {
          ccode = IRToJavascript.traverseTree(el, ccode, level);
        }
        // let oscCode = `this.OSCTransducer('${el['@oscaddr'].value}',${idxCode})`;

        // IRToJavascript.traverseTree(el['@oscaddr'], IRToJavascript.emptyCode(), level+1);

        // ccode.setup += `${setupCode}`;
        // ccode.loop += `${oscCode}`;

        // console.log(ccode.paramMarkers);

        return ccode;
      },
      '@num': (ccode, el) => {
        if (el.value) {
          // console.log(el.value);
          ccode.loop += `${el.value}`;
        } else {
          ccode = IRToJavascript.traverseTree(el, ccode, level);
        }
        return ccode;
      },
      '@oscaddr': (ccode, el) => {
        console.log(el);
        // ccode.loop += `${el.value}`;
        ccode.loop += `this.OSCTransducer('${el.value}')`;
        return ccode;
      },
      '@sample': (ccode,el) => {

      }
      // '@func': (ccode, el) => {
      //   // console.log(el);
      //   let newCode = IRToJavascript.traverseTree(el, ccode);
      //   newCode.loop += ")";
      //   return newCode;
      // },
      // '@comp': (ccode, el) => {
      //   // console.log("comp")
      //   // console.log(el);
      //   el.map((compEl) => {
      //     // console.log(compEl);
      //     ccode = IRToJavascript.traverseTree(compEl, ccode);
      //   });
      //   ccode.loop += ")";
      //   return ccode;
      // },
      // '@osc': (ccode, el) => {
      //   // console.log("OSC");
      //   // console.log(el);
      //   // console.log(code);
      //   let objName = "osc" + IRToJavascript.getNextID();
      //   ccode.setup += `q.${objName} = new Module.maxiOsc();`;
      //   ccode.loop += `q.${objName}.${oscMap[el]}(`;
      //   return ccode;
      // },
      // '@io': (ccode, el) => {
      //   console.log('IO');
      //   console.log(el);
      //   return IRToJavascript.traverseTree(el, ccode);
      // },
      // '@OSCMsg': (ccode, el) => {
      //   console.log('OSCMsg');
      //   console.log(el);
      //   ccode.loop += `(this.OSCTransducer('${el.addr}', 0)`;
      //   return ccode;
      // },
      // '@MLModel': (ccode, el) => {
      //   let objName = "wkt" + IRToJavascript.getNextID();
      //   ccode.setup += `q.${objName} = this.registerTransducer('testmodel', ${el.input});`;
      //   ccode.loop += `(q.${objName}.io(${el.input})`;
      //   return ccode;
      // },
      // '@add': (ccode, el) => {
      //   // console.log(el);
      //   //expecting two arguments
      //   let code1 = IRToJavascript.traverseTree(el[0], IRToJavascript.emptyCode());
      //   let code2 = IRToJavascript.traverseTree(el[1], IRToJavascript.emptyCode());
      //   ccode.setup += code1.setup + code2.setup;
      //   ccode.loop += `(${code1.loop}) + ${code2.loop})`;
      //   return ccode;
      // },
      // 'param': (ccode, p) => {
      //   ccode.loop += p;
      //   return ccode;
      // }
    }
    console.log("Traverse")
    console.log(t)
    if (Array.isArray(t)) {
      t.map((el) => {
        Object.keys(el).map((k) => {
          code = attribMap[k](code, el[k]);
        });
      })
    } else {
      Object.keys(t).map((k) => {
        console.log(k);
        code = attribMap[k](code, t[k]);
      });
    }
    return code;
  }

  static treeToCode(tree) {
    // console.log(tree);
    let code = IRToJavascript.traverseTree(tree, IRToJavascript.emptyCode(), 0);
    code.setup = `() => {let q=this.newq(); ${code.setup}; return q;}`;
    code.loop = `(q, inputs) => {return ${code.loop};}`
    console.log(code.loop);
    console.log(code.paramMarkers);
    return code;
  }

}

export default IRToJavascript;
