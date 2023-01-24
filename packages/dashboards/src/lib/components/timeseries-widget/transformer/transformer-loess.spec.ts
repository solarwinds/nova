import { transformLoessSmoothing } from "./transformer-loess";
import { mockTimeSeriesData } from "./transformer.spec";

describe("TransformerLoess", () => {
    it("should apply smoothing to time series data", () => {
        const expectedTransformedDataY =  [1.46159523903043, 1.420907393709058, 1.3831123574345838, 1.3484856385039166, 1.3183406678726897, 1.292602436427842, 1.2726403606648091, 1.2589456659479765, 1.251294114998018, 1.2494371902139392, 1.2521076072007418, 1.2580528287799098, 1.279942970664706, 1.279140071303118, 1.26115121942712, 1.2365278007637244, 1.2119349575659726, 1.1940947673342635, 1.1859249827975873, 1.1860089342226274, 1.1898017734638415, 1.1868552629603073, 1.1687084480654448, 1.131928440881893, 1.0795229852665216, 1.0186671477276832, 0.9598599413438933, 0.9192595280474052, 0.9066540668427479, 0.920537633006461, 0.9506567479402293, 0.9812845686683431, 0.9982965392409824, 0.9986284724054713, 0.9890350384666817, 0.9762325155024882, 0.9615029611159116, 0.9439896790136117, 0.9270612764230464, 0.9165439133357722, 0.9119957964576315, 0.9075459628511453, 0.9052259848867834, 0.9117860728001688, 0.9329145152296405, 0.9705286286771297, 1.0215464781504124, 1.0806563628138974, 1.1502099676290527, 1.2329954581800848, 1.3274507847381756, 1.4316589604131877, 1.5352001836290583, 1.6319150660419837, 1.7160455690464005, 1.7860548392636701, 1.8466780410381034, 1.9037093942752108, 1.9600175967207178, 2.0152840156224556, 2.058837456832407, 2.078411282171146, 2.065297215405735, 2.022344900527969, 1.965642893104814, 1.9090925622731447, 1.8628963980590925, 1.831663574615959, 1.8134639292838983, 1.8044175953837112, 1.806399071465421, 1.8117964173216023, 1.8117380410476471, 1.8009973893495044, 1.7807060973427724, 1.7633599778055213, 1.7563246832578443, 1.7643968181801029, 1.7864439944387414, 1.8139528416650137, 1.8320191756938584, 1.831051460641902, 1.8050224752514623, 1.7618398187914863, 1.713528132182546, 1.6745942014094908, 1.6508055203594267, 1.641481143888086, 1.6424209018805414, 1.6432317016463003, 1.6356164615317539, 1.6214453256034176, 1.6059982019372399, 1.5874706298709498, 1.571514775059768, 1.5614196087262826, 1.557764706769376, 1.557627291069366, 1.5591667155676987, 1.565188101521926, 1.5815095103789645, 1.604699022776913, 1.6245283442840446, 1.633151277754223, 1.625021254265448, 1.6108108638436534, 1.6005957973393379, 1.5998862887863652, 1.6129307272058213, 1.6385737132550275, 1.6657844545698026, 1.687375850866374, 1.7000070463764132, 1.6985888754425105, 1.6785601218871307, 1.6391025032207835, 1.589957391784992, 1.538550421857508, 1.497971617092844, 1.480288833132363, 1.4901877603842877, 1.5169692621711874, 1.545590430876473, 1.5578063531866064, 1.5452609026324353, 1.5085701281568618, 1.4543491561198607, 1.391661353962263, 1.3269366841414012, 1.2666964617092162, 1.2252066544024274, 1.2102556866011582, 1.2249933644779958, 1.2606961228593718, 1.3005001946439734, 1.3362021835055202, 1.369016038312111, 1.4030068325810134, 1.4491402468411252, 1.5159074026159942, 1.6022844975814223, 1.6994454830419272, 1.7989604454487562, 1.8880797463934869, 1.9540692667360418, 1.9843480404015281, 1.9799893571762368, 1.9496015758486465, 1.9032160976203158, 1.8479313307907432, 1.788629885064438, 1.7262100119842216, 1.6675848428858444, 1.6124113699770533, 1.5594487921334803, 1.5094231878465507, 1.474196604329336, 1.460232035111403, 1.4694100201013498, 1.4944592106621712, 1.5204286178341135, 1.531649603653932, 1.5255809852269522, 1.5105631655460456, 1.493149611109402, 1.4702589252847247, 1.4452658450172748, 1.4264977847924456, 1.4150259399029892, 1.407405874982942, 1.3940193648450077, 1.3704640464275144, 1.3385832173516974, 1.3065637483086903, 1.2798784719852847, 1.2606813275742752, 1.2549028411740437, 1.2662238556804368, 1.2968271888821619, 1.3386486731178593, 1.3826577476866078, 1.4214417191687971, 1.451992029324174, 1.4767699706717394, 1.4973649397143163, 1.5126523506478406, 1.527006644901121, 1.546021151705645, 1.5734431033488363, 1.6043875708419364, 1.6339556198072387, 1.6610633811797015, 1.6810508239261708, 1.694681071321611, 1.6983690025263058, 1.6969199189697974, 1.6940672873170115, 1.7001889573875815, 1.7202498228289187, 1.7515219773049466, 1.7826351107505616, 1.803203445946565, 1.8136002624814864, 1.8148336915567143, 1.8084010915335966, 1.793158399494132, 1.768615517881699, 1.7404656846192665, 1.7088969780597836, 1.6727804688271135, 1.6351764522842132, 1.6005000348086469, 1.5760430673253722, 1.562684453878319, 1.5534354245173745, 1.542898780190228, 1.526680495495384, 1.5079954184329836, 1.4929055706597865, 1.4831942300370429, 1.473745550932108, 1.4582929932075785, 1.4325775498873554, 1.404763367259875, 1.3847065708832815, 1.372554021771066, 1.3643722241395153, 1.3528714995482005, 1.3345929300994612, 1.3179404499242082, 1.2842452381155454, 1.2443778553279117, 1.2030802531226072, 1.163075325282989, 1.1257748174248263, 1.091600980143994, 1.0595503334188834, 1.0287391140009277, 0.9978325644042343, 0.9663157290196978];
        const actualTransformedDataY = transformLoessSmoothing(mockTimeSeriesData, false).map(d => d.y);
        expect(actualTransformedDataY).toEqual(expectedTransformedDataY);
    });
});
