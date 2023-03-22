// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { transformLinReg } from "./transformer-lin-reg";
import { mockTimeSeriesData } from "./transformer.spec";

describe("TransformerLinReg", () => {
    it("should apply linear regression to time series data", () => {
        const expectedTransformedDataY = [
            1.6696558086141522, 1.668807573117192, 1.6679593376193225,
            1.6671111021223624, 1.6662628666244927, 1.6654146311266231,
            1.664566395629663, 1.6637181601317934, 1.6628699246348333,
            1.6620216891369637, 1.6611734536400036, 1.660325218142134,
            1.6594769826442644, 1.6586287471473042, 1.6577805116494346,
            1.6569322761524745, 1.656084040654605, 1.6552358051576448,
            1.6543875696597752, 1.653539334162815, 1.6526910986649455,
            1.6518428631670758, 1.6509946276701157, 1.6501463921722461,
            1.649298156675286, 1.6484499211774164, 1.6476016856804563,
            1.6467534501825867, 1.645905214684717, 1.645056979187757,
            1.6442087436898873, 1.6433605081929272, 1.6425122726950576,
            1.6416640371980975, 1.640815801700228, 1.6399675662032678,
            1.6391193307053982, 1.6382710952075286, 1.6374228597105684,
            1.6365746242126988, 1.6357263887157387, 1.6348781532178691,
            1.634029917720909, 1.6331816822230394, 1.6323334467251698,
            1.6314852112282097, 1.63063697573034, 1.62978874023338,
            1.6289405047355103, 1.6280922692385502, 1.6272440337406806,
            1.6263957982437205, 1.6255475627458509, 1.6246993272479813,
            1.6238510917510212, 1.6230028562531515, 1.6221546207561914,
            1.6213063852583218, 1.6204581497613617, 1.619609914263492,
            1.6187616787656225, 1.6179134432686624, 1.6170652077707928,
            1.6162169722738327, 1.615368736775963, 1.614520501279003,
            1.6136722657811333, 1.6128240302841732, 1.6119757947863036,
            1.611127559288434, 1.6102793237914739, 1.6094310882936043,
            1.6085828527966441, 1.6077346172987745, 1.6068863818018144,
            1.6060381463039448, 1.6051899108060752, 1.604341675309115,
            1.6034934398112455, 1.6026452043142854, 1.6017969688164158,
            1.6009487333194556, 1.600100497821586, 1.599252262324626,
            1.5984040268267563, 1.5975557913288867, 1.5967075558319266,
            1.595859320334057, 1.5950110848370969, 1.5941628493392273,
            1.5933146138422671, 1.5924663783443975, 1.591618142846528,
            1.5907699073495678, 1.5899216718516982, 1.589073436354738,
            1.5882252008568685, 1.5873769653599084, 1.5865287298620387,
            1.5856804943650786, 1.584832258867209, 1.5839840233693394,
            1.5831357878723793, 1.5822875523745097, 1.5814393168775496,
            1.58059108137968, 1.5797428458827198, 1.5788946103848502,
            1.5780463748869806, 1.5771981393900205, 1.576349903892151,
            1.5755016683951908, 1.5746534328973212, 1.573805197400361,
            1.5729569619024915, 1.5721087264055313, 1.5712604909076617,
            1.5704122554097921, 1.569564019912832, 1.5687157844149624,
            1.5678675489180023, 1.5670193134201327, 1.5661710779231726,
            1.565322842425303, 1.5644746069274333, 1.5636263714304732,
            1.5627781359326036, 1.5619299004356435, 1.561081664937774,
            1.5602334294408138, 1.5593851939429442, 1.558536958445984,
            1.5576887229481144, 1.5568404874502448, 1.5559922519532847,
            1.5551440164554151, 1.554295780958455, 1.5534475454605854,
            1.5525993099636253, 1.5517510744657557, 1.550902838967886,
            1.550054603470926, 1.5492063679730563, 1.5483581324760962,
            1.5475098969782266, 1.5466616614812665, 1.5458134259833969,
            1.5449651904864368, 1.5441169549885672, 1.5432687194906975,
            1.5424204839937374, 1.5415722484958678, 1.5407240129989077,
            1.539875777501038, 1.539027542004078, 1.5381793065062084,
            1.5373310710083388, 1.5364828355113787, 1.535634600013509,
            1.534786364516549, 1.5339381290186793, 1.5330898935217192,
            1.5322416580238496, 1.5313934225268895, 1.5305451870290199,
            1.5296969515311503, 1.5288487160341901, 1.5280004805363205,
            1.5271522450393604, 1.5263040095414908, 1.5254557740445307,
            1.524607538546661, 1.5237593030487915, 1.5229110675518314,
            1.5220628320539618, 1.5212145965570016, 1.520366361059132,
            1.519518125562172, 1.5186698900643023, 1.5178216545673422,
            1.5169734190694726, 1.516125183571603, 1.5152769480746429,
            1.5144287125767733, 1.5135804770798131, 1.5127322415819435,
            1.5118840060849834, 1.5110357705871138, 1.5101875350901537,
            1.509339299592284, 1.5084910640944145, 1.5076428285974544,
            1.5067945930995847, 1.5059463576026246, 1.505098122104755,
            1.504249886607795, 1.5034016511099253, 1.5025534156120557,
            1.5017051801150956, 1.500856944617226, 1.5000087091202658,
            1.4991604736223962, 1.4983122381254361, 1.4974640026275665,
            1.4966157671306064, 1.4957675316327368, 1.4949192961348672,
            1.494071060637907, 1.4932228251400375, 1.4923745896430773,
            1.4915263541452077, 1.4906781186482476, 1.489829883150378,
            1.4889816476525084, 1.4881334121555483, 1.4872851766576787,
            1.4864369411607186, 1.485588705662849, 1.4847404701658888,
            1.4838922346680192, 1.4830439991710591, 1.4821957636731895,
            1.48134752817532, 1.4804992926783598, 1.4796510571804902,
            1.47880282168353, 1.4779545861856604, 1.4771063506887003,
            1.4762581151908307, 1.4754098796929611, 1.474561644196001,
            1.4737134086981314, 1.4728651732011713, 1.4720169377033017,
            1.4711687022063415, 1.470320466708472, 1.4694722312115118,
            1.4686239957136422, 1.4677757602157726, 1.4669275247188125,
        ];
        const actualTransformedDataY = transformLinReg(
            mockTimeSeriesData,
            false
        ).map((d) => d.y);
        expect(actualTransformedDataY).toEqual(expectedTransformedDataY);
    });
});
